"use client";

import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import React from "react";
import {
  BloodGroup,
  BloodGroupInventoryStats,
  BLOOD_GROUPS,
} from "@/lib/contracts/admin/inventory-stats";

const InOutBarChart = ({
  data,
}: {
  data: Record<BloodGroup, BloodGroupInventoryStats>;
}) => {
  const formattedData = BLOOD_GROUPS.filter((group) => data[group]).map(
    (group) => ({
      name: group,
      inFlow: data[group].in.quantity,
      outFlow: data[group].out.quantity,
      totalRequested: data[group].requestStats.totalRequestedQuantity,
    }),
  );

  console.log("Formatted data: ", formattedData);
  return (
    <div>
      <BarChartExample groupData={formattedData} />
    </div>
  );
};

// #region Sample data
const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
  },
  {
    name: "Page G1",
    uv: 3490,
    pv: 4300,
  },
];

const BarChartExample = ({
  groupData,
}: {
  groupData: {
    name: BloodGroup;
    inFlow: number;
    outFlow: number;
    totalRequested: number;
  }[];
}) => {
  const minChartWidth = groupData.length * 80; // 👈 key line

  return (
    <div className="w-full overflow-x-auto mb-6 scroll-smooth ">
      <div
        className="h-[360px] sm:h-[420px]"
        style={{ minWidth: minChartWidth }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={groupData}
            margin={{ top: 32, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
            <YAxis
              tick={{ fontSize: 12 }}
              hide
              domain={[0, (dataMax: number) => dataMax * 1.15]}
            />
            <Tooltip />
            <Legend />

            <Bar dataKey="inFlow" name="Donation" fill="#25D366" barSize={28}>
              <LabelList
                dataKey="inFlow"
                position="top"
                className="fill-slate-700 text-xs font-semibold"
              />
            </Bar>

            <Bar dataKey="outFlow" name="Granted" fill="#ff2c2c" barSize={28}>
              <LabelList
                dataKey="outFlow"
                position="top"
                className="fill-slate-700 text-xs font-semibold"
              />
            </Bar>

            <Bar
              dataKey="totalRequested"
              name="Requests"
              fill="#0088CC"
              barSize={28}
            >
              <LabelList
                dataKey="totalRequested"
                position="top"
                className="fill-slate-700 text-xs font-semibold"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InOutBarChart;
