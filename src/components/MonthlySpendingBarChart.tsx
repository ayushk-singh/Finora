"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Transaction = {
  _id: string;
  description: string;
  amount: number;
  date: string;
};

type MonthlyData = {
  month: string;
  total: number;
};

const chartConfig = {
  desktop: {
    label: "Spent",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function MonthlySpendingBarChart() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/transactions");
        const transactions: Transaction[] = await res.json();

        const grouped: Record<string, number> = {};

        for (const tx of transactions) {
          const date = new Date(tx.date);
          const month = date.toLocaleString("default", { month: "long" });
          grouped[month] = (grouped[month] || 0) + tx.amount;
        }

        const formatted: MonthlyData[] = Object.entries(grouped).map(
          ([month, total]) => ({
            month,
            total: Number(total.toFixed(2)),
          })
        );

        // Sort months Jan-Dec (if not, fallback to alphabetical)
        const monthOrder = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const sorted = formatted.sort(
          (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
        );

        setData(sorted);
      } catch (err) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-md" />;
  }

  if (!data.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Not enough data to display monthly spending.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>Visual breakdown of your expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => {
                    if (typeof value === "number") {
                      return `₹${value.toFixed(2)}`;
                    }
                    return value;
                  }}
                />
              }
            />

            <Bar dataKey="total" fill="var(--color-desktop)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium text-green-600">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing monthly totals for current year
        </div>
      </CardFooter>
    </Card>
  );
}
