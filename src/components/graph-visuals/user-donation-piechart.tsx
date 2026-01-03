"use client";

import { useMemo } from "react";
import { Droplet, ShieldCheck, Calendar, Activity } from "lucide-react";
import { Label, Pie, PieChart, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
  DonationDashboardResponseSchema,
  GroupWiseBreakdown,
  type DonationDashboardResponse,
} from "@/lib/contracts/donation";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// --- Configuration ---
const BLOOD_COLORS: Record<string, string> = {
  "A+": "#ef4444",
  "A-": "#f87171",
  "AB+": "#8b5cf6",
  "AB-": "#a78bfa",
  "B+": "#f59e0b",
  "B-": "#fbbf24",
  "O+": "#10b981",
  "O-": "#34d399",
};

const chartConfig = {
  quantity: { label: "Units" },
} satisfies ChartConfig;

const fetchDonationSummary = async (): Promise<DonationDashboardResponse> => {
  const resp = await fetch("/api/donation?desc=summary");
  if (!resp.ok) throw new Error("Failed to fetch");
  const json = await resp.json();
  return DonationDashboardResponseSchema.parse(json);
};

export default function UserDonationDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["user-donation-summary"],
    queryFn: fetchDonationSummary,
  });

  const chartData = useMemo(() => {
    if (!data?.data?.groupWiseBreakdown) return [];
    return data.data.groupWiseBreakdown
      .filter((item: GroupWiseBreakdown) => item.quantity > 0)
      .map((item) => ({
        name: item.group,
        value: item.quantity,
        fill: BLOOD_COLORS[item.group],
      }));
  }, [data]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 animate-pulse font-medium">
        Loading Dashboard...
      </div>
    );

  const stats = data?.data?.summary;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-slate-50">
      {/* Lighter Pulsating Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-200/40 blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-rose-200/40 blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="z-10 w-full py-15 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Section: Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-emerald-600 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={16} /> Verified Impact
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-none tracking-tighter">
            Every Drop <br />
            <span className="text-rose-500">Counts.</span>
          </h1>

          <p className="text-slate-500 text-lg max-w-md leading-relaxed">
            Your journey as a donor has provided hope to those in need. Below is
            your contribution profile and unit distribution.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
                Total Units
              </p>
              <h3 className="text-4xl font-black text-slate-800">
                {stats?.totalQuantity}
                <span className="text-sm font-medium ml-1">ml</span>
              </h3>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
                Sessions
              </p>
              <h3 className="text-4xl font-black text-slate-800">
                {stats?.totalDonationsCount}
                <span className="text-sm font-medium ml-1">times</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Right Section: The Chart */}
        <div className="relative aspect-square flex items-center justify-center rounded-[4rem] bg-white border border-slate-200 shadow-xl transition-transform hover:scale-[1.01] duration-500">
          <ChartContainer config={chartConfig} className="w-full h-full p-10">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="bg-white border-slate-200 text-slate-900 rounded-xl shadow-lg"
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={5}
                strokeWidth={0}
              >
                {chartData.map((entry, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox && "cy" in viewBox))
                      return null;

                    const cx = viewBox.cx;
                    const cy = viewBox.cy;

                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          dy="-4"
                          className="fill-slate-900 text-6xl font-black"
                        >
                          {stats?.totalDonationsCount}
                        </tspan>

                        <tspan
                          x={cx}
                          dy="32"
                          className="fill-slate-400 text-sm font-bold uppercase tracking-widest"
                        >
                          Donations
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* Decorative Float Icon */}
          <div className="absolute top-10 right-10 text-rose-500/20">
            <Droplet size={48} fill="currentColor" className="animate-bounce" />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-16 flex items-center gap-6 text-slate-400 text-sm font-medium">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            Last activity:{" "}
            {stats?.lastDonationAt
              ? new Date(stats.lastDonationAt).toLocaleDateString()
              : "No data"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={16} />
          <span className="text-emerald-500">Live Dashboard</span>
        </div>
      </div>
    </div>
  );
}
