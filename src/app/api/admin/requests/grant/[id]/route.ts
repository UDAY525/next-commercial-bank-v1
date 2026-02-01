import { getUserId, isUserAdmin } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import RequestGrantsModel from "@/models/RequestGrants";
import connectDB from "@/connectDB";
import { RequestGrantResponse } from "@/lib/contracts/admin/request-grant";
import BloodTransactionsModel from "@/models/BloodTransactions";
import mongoose from "mongoose";
import { triggerEmail } from "@/lib/email";
import { EmailType } from "@/lib/email/types";
import User from "@/models/User";

// In Next 16, params is a Promise that must be awaited
type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest) {
  // 1. Await the params object first
  // const { id } = await params;

  console.log(`Matched Dynamic Route for ID:`);

  return NextResponse.json({
    success: true,
    message: `Next 16 Dynamic Route works! ID:`,
  });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  await connectDB();

  const { id } = await params;
  const { status } = await req.json();

  const userId = await getUserId();
  const isAdmin = await isUserAdmin();

  if (!userId || !isAdmin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const nextStatus = status?.toLowerCase();
  if (!["pending", "granted", "rejected"].includes(nextStatus)) {
    return NextResponse.json(
      { success: false, error: "Invalid status" },
      { status: 422 },
    );
  }

  const request = await RequestGrantsModel.findById(id);
  if (!request) {
    return NextResponse.json(
      { success: false, error: "Request not found" },
      { status: 404 },
    );
  }

  const prevStatus = request.status;

  // ❌ Block invalid transitions
  if (prevStatus === "granted" && nextStatus === "pending") {
    return NextResponse.json(
      { success: false, error: "Cannot revert granted request to pending" },
      { status: 400 },
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1️⃣ Update request status
    request.status = nextStatus;
    await request.save({ session });

    /**
     * 2️⃣ Handle BLOOD TRANSACTION
     */

    // 👉 GRANTED (from pending or rejected)
    if (nextStatus === "granted" && !request.bloodTransactionCreated) {
      await BloodTransactionsModel.create(
        [
          {
            userId: request.userId,
            type: "OUT",
            phone: request.phone,
            bloodGroup: request.bloodGroup,
            quantity: request.quantity,
          },
        ],
        { session },
      );

      request.bloodTransactionCreated = true;
      await request.save({ session });
    }

    // 👉 ROLLBACK: granted → rejected
    if (
      prevStatus === "granted" &&
      nextStatus === "rejected" &&
      request.bloodTransactionCreated
    ) {
      await BloodTransactionsModel.deleteOne(
        {
          userId: request.userId,
          bloodGroup: request.bloodGroup,
          quantity: request.quantity,
          type: "OUT",
        },
        { session },
      );

      request.bloodTransactionCreated = false;
      await request.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // Trigger mail service
    const userMailInfo = await User.findById(request.userId).select(
      "name email",
    );
    triggerEmail(
      request.status === "granted"
        ? EmailType.GRANT_APPROVED
        : request.status === "rejected"
          ? EmailType.GRANT_REJECTED
          : EmailType.GRANT_PENDING,
      {
        to: userMailInfo?.email ?? "",
        name: userMailInfo?.name ?? "user.name",
        bloodGroup: request.bloodGroup,
        quantity: request.quantity,
      },
    ).catch(console.error);

    return NextResponse.json({
      success: true,
      data: {
        id: request._id.toString(),
        status: request.status,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to update request" },
      { status: 500 },
    );
  }
}
