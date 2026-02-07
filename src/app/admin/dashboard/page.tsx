"use client";

import BloodGroupDashboard from "@/components/admin/admin-all-blood-group-stats";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import InOutBarChart from "@/components/graph-visuals/in-out-flows-batchart";

const AdminDashBoard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["all-blood-summary-stat"],
    queryFn: async () => {
      const res = await fetch("/api/admin/inventory-stats");
      if (!res?.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  if (isLoading) return null;

  console.log(data?.filteredByBloodGroup);
  return (
    <div className="max-w-7xl mx-auto p-4">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Inventory <span className="text-rose-600">Analytics</span>
        </h1>
        <p className="text-slate-500 mt-2">
          Real-time blood stock and donor participation levels.
        </p>
      </header>
      <InOutBarChart data={data?.byBloodGroup} />
      <BloodGroupDashboard data={data?.byBloodGroup} />{" "}
    </div>
  );
};

export default AdminDashBoard;
