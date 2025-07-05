"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthlySpendingBarChart } from "./MonthlySpendingBarChart";

// Colors for chart
const COLORS = [
  "#4f46e5",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#0ea5e9",
  "#8b5cf6",
];

// Define types
type Transaction = {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
};

type CategoryBreakdown = {
  category: string;
  name: string;
  total: number;
};

type Summary = {
  total: number;
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: Transaction[];
};

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      const res = await fetch("/api/transactions/summary");
      const data = await res.json();

      // Add 'name' field for recharts label
      const updatedBreakdown = data.categoryBreakdown.map(
        (entry: { category: string; total: number }) => ({
          ...entry,
          name: entry.category,
        })
      );

      setSummary({
        total: data.total,
        categoryBreakdown: updatedBreakdown,
        recentTransactions: data.recentTransactions,
      });

      setLoading(false);
    }

    fetchSummary();
  }, []);

  if (loading || !summary) {
    return <Skeleton className="h-64 w-full rounded-md" />;
  }

  return (
    <div className="w-full px-4 py-6 pb-safe">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{summary.total.toFixed(2)}
          </CardContent>
        </Card>

        {/* Monthly Spending Bar Chart */}
        <div className="md:col-span-2">
          <MonthlySpendingBarChart />
        </div>

        {/* Recent Transactions */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[250px] overflow-y-auto">
            <ul className="space-y-2">
              {summary.recentTransactions.map((tx) => (
                <li
                  key={tx._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>{tx.description}</span>
                  <span className="text-sm text-muted-foreground">
                    ₹{tx.amount.toFixed(2)} – {tx.category}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Category Breakdown Pie Chart */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Category-wise Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="total"
                  nameKey="name"
                  data={summary.categoryBreakdown}
                  outerRadius={100}
                  label={({ name, value }) =>
                    value !== undefined ? `${name}: ₹${value.toFixed(0)}` : name
                  }
                >
                  {summary.categoryBreakdown.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}