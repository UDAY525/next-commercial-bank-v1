"use server";

import React, { Suspense } from "react";
import { getUserId } from "@/lib/session";
import connectDB from "@/connectDB";
import DonationDataTable from "./DonationDataTable";
import BloodTransactionsModel from "@/models/BloodTransactions";

async function fetchDonationsFromUserTransactions() {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  await connectDB();
  const donations = await BloodTransactionsModel.find({
    userId,
    type: "IN",
  })
    .lean()
    .exec();
  return donations;
}

async function DonationTableContent() {
  const donationTransactions = await fetchDonationsFromUserTransactions();

  if (!donationTransactions || donationTransactions.length === 0) {
    return (
      <div className="p-4 text-gray-600">
        No donations found. Start donating today!
      </div>
    );
  }

  // Serialize Mongoose ObjectIds and dates to plain objects
  const serializedDonations = donationTransactions.map((donation) => ({
    _id: donation._id.toString(),
    bloodGroup: donation.bloodGroup,
    quantity: donation.quantity,
    donatedAt: donation.createdAt?.toString() || null,
  }));

  return <DonationDataTable donations={serializedDonations} />;
}

function DonationTableFallback() {
  return (
    <div className="p-4">
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 0%,
            #e0e0e0 50%,
            #f0f0f0 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-full shimmer"></div>
        <div
          className="h-8 bg-gray-200 rounded w-full shimmer"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="h-8 bg-gray-200 rounded w-full shimmer"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
}

const UserDonationTable = () => {
  return (
    <Suspense fallback={<DonationTableFallback />}>
      <DonationTableContent />
    </Suspense>
  );
};

export default UserDonationTable;
