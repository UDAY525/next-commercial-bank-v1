import connectDB from "@/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Donation from "@/models/Donation";
import BloodTransactionsModel from "@/models/BloodTransactions";
import { group } from "console";
import {
  BloodGroup,
  InventoryStatsResponse,
  RequestStatusStats,
} from "@/lib/contracts/admin/inventory-stats";
import { Types } from "mongoose";
import RequestGrantsModel from "@/models/RequestGrants";

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const requestStatsByBloodGroup = await RequestGrantsModel.aggregate<{
      _id: BloodGroup;
      totalRequests: number;
      totalAcceptedRequests: number;
      totalRequestedQuantity: number;
      totalGrantedQuantity: number;
    }>([
      {
        $group: {
          _id: "$bloodGroup",
          totalRequests: { $sum: 1 },
          totalAcceptedRequests: {
            $sum: {
              $cond: [{ $eq: ["$status", "granted"] }, 1, 0],
            },
          },
          totalRequestedQuantity: { $sum: "$quantity" },
          totalGrantedQuantity: {
            $sum: {
              $cond: [{ $eq: ["$status", "granted"] }, "$quantity", 0],
            },
          },
        },
      },
    ]);
    const requestStatsByGroup = {} as Record<BloodGroup, RequestStatusStats>;

    for (const group of BLOOD_GROUPS) {
      const stat = requestStatsByBloodGroup.find((s) => s._id === group);

      const totalRequestedQuantity = stat?.totalRequestedQuantity ?? 0;
      const totalGrantedQuantity = stat?.totalGrantedQuantity ?? 0;

      requestStatsByGroup[group] = {
        totalRequests: stat?.totalRequests ?? 0,
        totalAcceptedRequests: stat?.totalAcceptedRequests ?? 0,
        totalRequestedQuantity,
        totalGrantedQuantity,
        fulfillmentPercentage:
          totalRequestedQuantity === 0
            ? 0
            : Number(
                ((totalGrantedQuantity / totalRequestedQuantity) * 100).toFixed(
                  2,
                ),
              ),
      };
    }

    const rawStats = await BloodTransactionsModel.aggregate<{
      _id: {
        bloodGroup: BloodGroup;
        type: "IN" | "OUT";
      };
      quantity: number;
      transactions: number;
      users: string[];
    }>([
      {
        $group: {
          _id: {
            bloodGroup: "$bloodGroup",
            type: "$type",
          },
          quantity: { $sum: { $toDouble: "$quantity" } },
          transactions: { $sum: 1 },
          users: { $addToSet: { $toString: "$userId" } },
        },
      },
    ]);

    const byBloodGroup = {} as InventoryStatsResponse["byBloodGroup"];

    let totalInQuantity = 0;
    let totalOutQuantity = 0;

    for (const group of BLOOD_GROUPS) {
      const groupStats = rawStats.filter((s) => s._id.bloodGroup === group);

      const inStat = groupStats.find((s) => s._id.type === "IN");
      const outStat = groupStats.find((s) => s._id.type === "OUT");

      const inQty = inStat?.quantity ?? 0;
      const outQty = outStat?.quantity ?? 0;

      totalInQuantity += inQty;
      totalOutQuantity += outQty;

      byBloodGroup[group] = {
        in: {
          quantity: inQty,
          transactions: inStat?.transactions ?? 0,
          uniqueUsers: inStat?.users.length ?? 0,
          userIds: inStat?.users.map(String) ?? [],
        },
        out: {
          quantity: outQty,
          transactions: outStat?.transactions ?? 0,
          uniqueUsers: outStat?.users.length ?? 0,
          userIds: outStat?.users.map(String) ?? [],
        },
        requestStats: requestStatsByGroup[group],
        netQuantity: inQty - outQty,
      };
    }

    return NextResponse.json({
      summary: {
        totalInQuantity,
        totalOutQuantity,
        netQuantity: totalInQuantity - totalOutQuantity,
      },
      byBloodGroup,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error?.message || "Internal Server Error" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
