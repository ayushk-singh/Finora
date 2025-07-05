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
  Tooltip,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const COLORS = [
  "#4f46e5", // indigo-600
  "#22c55e", // green-500
  "#ef4444", // red-500
  "#f59e0b", // amber-500
  "#0ea5e9", // sky-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#10b981", // emerald-500
  "#eab308", // yellow-500
  "#3b82f6", // blue-500
  "#a855f7", // purple-500
  "#14b8a6", // teal-500
];

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

        // Sort Jan–Dec
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

  if (loading) return <Skeleton className="h-64 w-full rounded-md" />;

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
        <ResponsiveContainer width="100%" height={400}>
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
            <Tooltip
              formatter={(value: any) =>
                typeof value === "number" ? `₹${value.toFixed(2)}` : value
              }
              cursor={{ fill: "transparent" }}
            />
            <Bar dataKey="total" radius={[6, 6, 6, 6]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing monthly totals for current year
        </div>
      </CardFooter>
    </Card>
  );
}
