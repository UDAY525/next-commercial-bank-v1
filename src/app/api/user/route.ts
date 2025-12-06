// app/api/me/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // your server-side auth export
import connectDB from "@/connectDB";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized in user" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session?.user?.id)
      .lean()
      .select(
        "name email image phone address role profileImage bloodGroup medicalHistory"
      ) // pick only fields you need
      .exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/me error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Extract fields from request
    const { name, phone, address, medicalHistory, bloodGroup, profileImage } =
      body;

    // OPTIONAL: basic validation — you can replace with zod for stricter checks
    const allowedBloodGroups = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ];
    if (bloodGroup && !allowedBloodGroups.includes(bloodGroup)) {
      return NextResponse.json(
        { error: "Invalid blood group" },
        { status: 400 }
      );
    }

    await connectDB();

    // Update only whitelisted fields
    const updateData: Record<string, string | string[] | undefined> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (medicalHistory !== undefined)
      updateData.medicalHistory = medicalHistory;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
        lean: true,
      }
    ).select(
      "name email image phone address role profileImage bloodGroup medicalHistory"
    );

    return NextResponse.json({ user: updatedUser, success: true });
  } catch (err) {
    console.error("POST /api/me error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
