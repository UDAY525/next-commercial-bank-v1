"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { requireAuth } from "@/lib/session";
import connectDB from "@/connectDB";
import Donation from "@/models/Donation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DonationsSummaryResponse } from "@/lib/types/user/donation";

export const description = "A donut chart with text";

const donationChartConfig = {
  visitors: { label: "Quantity Donated (ml)" },

  "A+": { label: "A+", color: "#FF6384" },
  "A-": { label: "A-", color: "#FF8A80" },

  "AB+": { label: "AB+", color: "#36A2EB" },
  "AB-": { label: "AB-", color: "#4FC3F7" },

  "B+": { label: "B+", color: "#FFCE56" },
  "B-": { label: "B-", color: "#FFF176" },

  "O+": { label: "O+", color: "#81C784" },
  "O-": { label: "O-", color: "#A5D6A7" },
} satisfies ChartConfig;

const bloodCharColorConfig = {
  "A+": "#FF6384",
  "A-": "#FF8A80",

  "AB+": "#36A2EB",
  "AB-": "#4FC3F7",

  "B+": "#FFCE56",
  "B-": "#FFF176",

  "O-": "#A5D6A7",
  "O+": "#81C784",
};

interface DonationType {
  _id: string;
  name: string;
  donatedBloodGroup: string;
  quantity: number;
  donatedAt?: string;
}

export default function UserDonationPieChart() {
  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [userDonations, setUserDonations] =
    useState<DonationsSummaryResponse | null>(null);
  const [totalDonationQuantity, setTotalDonationQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchDonations = async () => {
      const resp = await fetch("/api/donation?desc=summary");
      if (!resp.ok) throw new Error("Network response was not ok");

      const data: DonationsSummaryResponse = await resp.json();
      setUserDonations(data);
      setTotalDonations(data?.allDonationsByUser?.length);
      setTotalDonationQuantity(data?.totalQuantityOfDonations);
      console.log(data);
      return data;
    };
    fetchDonations();
  }, []);

  const donationChartData = useMemo(() => {
    if (!userDonations) return [];

    return userDonations.donatedBloodSummaryGroupWise.map((item) => ({
      browser: item.bloodGroup,
      visitors: item.quantity,
      fill: bloodCharColorConfig[item.bloodGroup],
    }));
  }, [userDonations]);

  // const totalDonation =

  const donationStats = useMemo(() => {
    if (!userDonations) return [];
  }, [userDonations]);

  if (!userDonations) return null;

  console.log(userDonations, donationChartConfig, donationChartData);
  return (
    <Card className="flex flex-col bg-linear-to-r from-blue-50 to-blue-100 hover:bg-linear-to-r hover:from-blue-100 hover:to-blue-200 border-b border-gray-200 w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Your donation pie chart</CardTitle>
        <CardDescription>
          Breakdown of How Your Donation Is Allocated
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={donationChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="bg-white" hideLabel />}
            />
            <Pie
              data={donationChartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalDonations}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Donations
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          You have in total donated {totalDonationQuantity}ml of blood.{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
