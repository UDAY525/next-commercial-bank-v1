import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/connectDB";
import Donation from "@/models/Donation";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const { name, phone, donatedBloodGroup, quantity } = body;

  // Get the current user session directly from NextAuth
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized - no session found" },
      { status: 401 }
    );
  }

  const donarId = session.user.id;

  try {
    const donation = await Donation.create({
      donarId,
      name,
      phone,
      donatedBloodGroup,
      quantity,
    });

    return NextResponse.json({ donation, success: true });
  } catch (error) {
    console.error("POST /api/donation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
