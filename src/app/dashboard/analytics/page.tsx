import React from "react";
import { MonthlySpendingBarChart } from "@/components/MonthlySpendingBarChart";

function page() {
  return (
    <div className="p-6 max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <MonthlySpendingBarChart />
    </div>
  );
}

export default page;
