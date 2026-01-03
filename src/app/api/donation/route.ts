import {
  DonationBloodGroup,
  GroupWiseBreakdown,
} from "./../../../lib/contracts/donation";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/connectDB";
import Donation from "@/models/Donation";
import { z } from "zod";
import { getUserId } from "@/lib/session";
import {
  DonationDashboardData,
  DonationDashboardResponseSchema,
  type DonationDashboardResponse,
} from "@/lib/contracts/donation";
import BloodTransactionsModel from "@/models/BloodTransactions";
import mongoose from "mongoose";

// Validation schema for donation
const donationSchema = z.object({
  phone: z.string().regex(/^\d{10,}$/, "Phone must be at least 10 digits"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
});

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "AB+",
  "AB-",
  "B+",
  "B-",
  "O+",
  "O-",
] as const;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const stats = await BloodTransactionsModel.aggregate([
      { $match: { userId: userObjectId, type: "IN" } },
      {
        $facet: {
          history: [
            { $sort: { createdAt: -1 } },
            {
              $project: {
                id: { $toString: "$_id" },
                _id: 0,
                type: 1,
                phone: 1,
                bloodGroup: 1,
                quantity: 1,
                createdAt: { $toString: "$createdAt" },
              },
            },
          ],
          groupWise: [
            {
              $group: {
                _id: "$bloodGroup",
                totalQuantity: { $sum: "$quantity" },
                count: { $sum: 1 },
              },
            },
          ],
          overall: [
            {
              $group: {
                _id: null,
                totalQuantity: { $sum: "$quantity" },
                totalCount: { $sum: 1 },
                lastDonation: { $max: "$createdAt" },
              },
            },
          ],
        },
      },
    ]);

    const result = stats[0];

    const groupWiseBreakdown: GroupWiseBreakdown[] = BLOOD_GROUPS.map(
      (group) => {
        const found = result.groupWise.find(
          (g: { _id: DonationBloodGroup }) => g._id === group
        );

        return {
          group,
          quantity: found?.totalQuantity ?? 0,
          count: found?.count ?? 0,
        };
      }
    );

    const responseData: DonationDashboardData = {
      summary: {
        totalQuantity: result.overall[0]?.totalQuantity ?? 0,
        totalDonationsCount: result.overall[0]?.totalCount ?? 0,
        lastDonationAt: result.overall[0]?.lastDonation?.toISOString() ?? null,
      },
      history: result.history,
      groupWiseBreakdown,
    };

    const response = DonationDashboardResponseSchema.parse({
      success: true,
      message: "Data retrieved successfully",
      data: responseData,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/donation error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const userId = await getUserId();

    console.warn("User Id: ", userId);

    if (!userId) {
      console.log("User Not Found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = donationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const { phone, bloodGroup, quantity } = validation.data;

    // // We use the "Ledger" style here
    const donation = await BloodTransactionsModel.create({
      userId: userId,
      type: "IN", // This identifies it as a donation
      phone,
      bloodGroup,
      quantity: quantity, // Ensure donations are always positive
      createdAt: new Date(),
    });

    // return NextResponse.json({ body });

    return NextResponse.json({ donation, success: true });
  } catch (error) {
    console.error("POST /api/donation error:", error);
    return NextResponse.json(
      { error: "Failed to create donation" },
      { status: 500 }
    );
  }
}
