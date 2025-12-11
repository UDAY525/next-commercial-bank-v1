import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/connectDB";
import Donation from "@/models/Donation";
import { z } from "zod";
import { getUserId } from "@/lib/session";
import {
  DonationSummaryItemSchema,
  DonationsSummaryResponseSchema,
} from "@/lib/types/user/donation";

// Validation schema for donation
const donationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10,}$/, "Phone must be at least 10 digits"),
  donatedBloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
});

const BLOOD_GROUPS: string[] = [
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
  await connectDB();
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized - no session found" },
      { status: 401 }
    );
  }

  const allDonationsByUser = await Donation.find({
    donarId: userId,
  })
    .lean()
    .select("donatedBloodGroup donatedAt quantity name phone")
    .exec();

  if (!allDonationsByUser || allDonationsByUser.length === 0) {
    return NextResponse.json({ allDonationsByUser: [] });
  }
  let totalQuantityOfDonations: number = 0;
  const donatedBloodSummaryGroupWise = BLOOD_GROUPS.map((group) => {
    return allDonationsByUser.reduce(
      (total, curr) => {
        if (curr.donatedBloodGroup === group) {
          totalQuantityOfDonations += parseInt(curr.quantity);
          return {
            bloodGroup: group,
            quantity: parseInt(total.quantity) + parseInt(curr.quantity),
            frequency: total.frequency + 1,
          };
        }

        return total;
      },
      {
        bloodGroup: group,
        quantity: 0,
        frequency: 0,
      }
    );
  });

  console.log(
    req.nextUrl.searchParams.get("desc"),
    donatedBloodSummaryGroupWise
  );

  if (req.nextUrl.searchParams.get("desc") === "summary") {
    const payload = {
      allDonationsByUser,
      donatedBloodSummaryGroupWise,
      totalQuantityOfDonations,
    };

    const parsed = DonationsSummaryResponseSchema.safeParse(payload);

    if (!parsed.success) {
      console.error("Response did not match schema:", parsed.error.format());
      // return sanitised response or error
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      allDonationsByUser,
      donatedBloodSummaryGroupWise,
      totalQuantityOfDonations,
    });
  }

  return NextResponse.json({
    allDonationsByUser,
  });
}

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized - no session found" },
      { status: 401 }
    );
  }

  // Validate request body
  const validation = donationSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, phone, donatedBloodGroup, quantity } = validation.data;

  try {
    const donation = await Donation.create({
      donarId: userId,
      name,
      phone,
      donatedBloodGroup,
      quantity,
      donatedAt: Date.now(),
    });

    return NextResponse.json({ donation, success: true });
  } catch (error) {
    console.error("POST /api/donation error:", error);
    return NextResponse.json(
      { error: "Failed to create donation" },
      { status: 500 }
    );
  }
}
