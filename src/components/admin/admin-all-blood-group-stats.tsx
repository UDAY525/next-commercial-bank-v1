import React from "react";
import { Droplet, Users, History, Activity } from "lucide-react";
import {
  BLOOD_GROUPS,
  BloodGroup,
  BloodGroupInventoryStats,
} from "@/lib/contracts/admin/inventory-stats";
import { group } from "console";

const BG_COLORS: Record<string, string> = {
  "A+": "bg-red-50 border-red-200 text-red-700 icon-bg-red-500",
  "A-": "bg-rose-50 border-rose-200 text-rose-700 icon-bg-rose-500",
  "B+": "bg-orange-50 border-orange-200 text-orange-700 icon-bg-orange-500",
  "B-": "bg-amber-50 border-amber-200 text-amber-700 icon-bg-amber-500",
  "AB+": "bg-purple-50 border-purple-200 text-purple-700 icon-bg-purple-500",
  "AB-": "bg-indigo-50 border-indigo-200 text-indigo-700 icon-bg-indigo-500",
  "O+": "bg-pink-50 border-pink-200 text-pink-700 icon-bg-pink-500",
  "O-": "bg-slate-50 border-slate-200 text-slate-700 icon-bg-slate-500",
};

const BloodGroupDashboard = ({
  data,
}: {
  data: Record<BloodGroup, BloodGroupInventoryStats>;
}) => {
  return (
    <div className="p-6 ">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Inventory <span className="text-rose-600">Analytics</span>
          </h1>
          <p className="text-slate-500 mt-2">
            Real-time blood stock and donor participation levels.
          </p>
        </header>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BLOOD_GROUPS.map((group) => {
            const stat: BloodGroupInventoryStats = data[group];
            const colorClass =
              BG_COLORS[group] || "bg-gray-50 border-gray-200 text-gray-700";

            return (
              <div
                key={group}
                className={`relative group overflow-hidden rounded-3xl border-2 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colorClass}`}
              >
                {/* Background Decorator */}
                <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-125 group-hover:rotate-12">
                  <Droplet size={120} fill="currentColor" />
                </div>

                <div className="relative z-10">
                  {/* Header: Blood Type */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-white shadow-sm">
                      <Droplet
                        className="text-rose-600"
                        size={24}
                        fill="currentColor"
                      />
                    </div>
                    <span className="text-4xl font-black tracking-tighter italic">
                      {group}
                    </span>
                  </div>

                  {/* Stats Main */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">
                        Stock Level
                      </p>
                      <h2 className="text-3xl font-bold flex items-baseline gap-1">
                        {stat.netQuantity}
                        <span className="text-sm font-medium">units</span>
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="opacity-60" />
                        <div>
                          <p className="text-xs font-bold leading-none">
                            {stat.in.uniqueUsers}
                          </p>
                          <p className="text-[9px] uppercase opacity-60">
                            Donors
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <History size={16} className="opacity-60" />
                        <div>
                          <p className="text-xs font-bold leading-none">
                            {stat.in.transactions}
                          </p>
                          <p className="text-[9px] uppercase opacity-60">
                            History
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (Visual indicator of stock health) */}
                <p className="mt-6 mb-2">Accomplishment</p>
                <div className=" h-1.5 w-full bg-black/5 rounded-full shadow  overflow-hidden">
                  <div
                    className="h-full bg-current opacity-40 rounded-full"
                    style={{
                      width: `${stat.requestStats?.fulfillmentPercentage}%`,
                      transition: "width 2s linear",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BloodGroupDashboard;
