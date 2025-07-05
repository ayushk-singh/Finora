"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
}

export function BudgetComparisonChart({ month }: { month: string }) {
  const [data, setData] = useState<BudgetComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComparison() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/budgets/comparison?month=${month}`);
        if (!res.ok) throw new Error("Failed to fetch comparison data.");
        const json: BudgetComparison[] = await res.json();
        setData(json);
      } catch {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    if (month) {
      fetchComparison();
    }
  }, [month]);

  if (loading) return <Skeleton className="h-[300px] w-full rounded-md" />;
  if (error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent className="text-red-500">{error}</CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual ({month})</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            barCategoryGap={16}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(val: number) => `₹${val.toFixed(2)}`}
              labelFormatter={(label) => `Category: ${label}`}
            />
            <Legend />
            <Bar dataKey="budgeted" fill="#6366f1" name="Budgeted" barSize={20} />
            <Bar dataKey="actual" fill="#10b981" name="Actual Spent" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
