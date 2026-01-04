"use client";

import BloodGroupDashboard from "@/components/admin/admin-all-blood-group-stats";
import { useQuery } from "@tanstack/react-query";
import React from "react";

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
    <div>
      <BloodGroupDashboard data={data?.byBloodGroup} />{" "}
    </div>
  );
};

export default AdminDashBoard;
