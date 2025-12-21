"use server";

import React, { Suspense } from "react";
import { getUserId } from "@/lib/session";
import connectDB from "@/connectDB";
import Donation from "@/models/Donation";
import DonationDataTable from "./DonationDataTable";

interface DonationType {
  _id: string;
  name: string;
  donatedBloodGroup: string;
  quantity: number;
  donatedAt?: string;
}

async function fetchDonations() {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  await connectDB();

  const donations = (await Donation.find({
    donarId: userId,
  })
    .lean()
    .exec()) as DonationType[];

  return donations;
}

async function DonationTableContent() {
  const donations = await fetchDonations();

  if (!donations || donations.length === 0) {
    return (
      <div className="p-4 text-gray-600">
        No donations found. Start donating today!
      </div>
    );
  }

  // Serialize Mongoose ObjectIds and dates to plain objects
  const serializedDonations = donations.map((donation) => ({
    _id: donation._id.toString(),
    name: donation.name,
    donatedBloodGroup: donation.donatedBloodGroup,
    quantity: donation.quantity,
    donatedAt: donation.donatedAt?.toString() || null,
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
