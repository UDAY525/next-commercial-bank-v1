import connectDB from "@/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Donation from "@/models/Donation";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Let MongoDB group the data (Much faster than JS reduce)
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: "$donatedBloodGroup",
          quantity: { $sum: { $toDouble: "$quantity" } },
          totalDonations: { $sum: 1 },
          // Collects unique donor IDs automatically
          donorsSet: { $addToSet: "$donarId" },
        },
      },
    ]);

    // 2. Map the results to include all blood groups even if they have 0 donations
    const filteredByBloodGroup = BLOOD_GROUPS.map((group) => {
      const groupData = stats.find((s) => s._id === group);

      return {
        bloodGroup: group,
        quantity: groupData?.quantity || 0,
        totalDonations: groupData?.totalDonations || 0,
        totalUsersDonated: groupData?.donorsSet?.length || 0,
        // Convert the array of unique IDs to a JSON string
        donarsList: groupData?.donorsSet || [],
      };
    });

    return NextResponse.json({ filteredByBloodGroup });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error?.message || "Internal Server Error" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
