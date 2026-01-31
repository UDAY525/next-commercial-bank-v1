import connectDB from "@/connectDB";
import { getUserId } from "@/lib/session";
import RequestGrantsModel from "@/models/RequestGrants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await RequestGrantsModel.aggregate([
      {
        $facet: {
          // 3️⃣ Requests grouped by blood group

          fullFillmentStats: [
            {
              $group: {
                _id: {
                  bloodGroup: "$bloodGroup",
                  status: "$status",
                },
              },
            },
          ],

          requestsByBloodGroup: [
            {
              $group: {
                _id: "$bloodGroup",
                count: { $sum: 1 },
              },
            },
          ],

          // 4️⃣ Grants grouped by blood group
          grantsByBloodGroup: [
            { $match: { status: "granted" } },
            {
              $group: {
                _id: "$bloodGroup",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const result = stats[0];

    // const totalRequests = result.totalRequests[0]?.count ?? 0;
    // const totalGrants = result.totalGrants[0]?.count ?? 0;

    // const fulfillmentRate =
    //   totalRequests === 0
    //     ? 0
    //     : Number(((totalGrants / totalRequests) * 100).toFixed(2));

    return NextResponse.json({
      success: true,
      data: {
        requestsByBloodGroup: result.requestsByBloodGroup,
        grantsByBloodGroup: result.grantsByBloodGroup,
        stats,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
