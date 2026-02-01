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

  return BloodTransactionsModel.find({
    userId,
    type: "IN",
  })
    .lean()
    .exec();
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

  const serializedDonations = donationTransactions.map((donation) => ({
    _id: donation._id.toString(),
    bloodGroup: donation.bloodGroup,
    quantity: donation.quantity,
    donatedAt: donation.createdAt?.toString() ?? null,
  }));

  return <DonationDataTable donations={serializedDonations} />;
}

function DonationTableFallback() {
  return (
    <div className="p-4">
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full" />
        <div className="h-8 bg-gray-200 rounded w-full" />
        <div className="h-8 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}

export default function UserDonationTable() {
  return (
    <Suspense fallback={<DonationTableFallback />}>
      <DonationTableContent />
    </Suspense>
  );
}
