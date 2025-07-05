import React from "react";
import { MonthlySpendingBarChart } from "@/components/MonthlySpendingBarChart";

function page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Analytics</h1>
      <MonthlySpendingBarChart />
    </div>
  );
}

export default page;
