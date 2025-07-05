import { dbConnect } from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const transactions = await Transaction.find();

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const categoryMap: Record<string, number> = {};
  transactions.forEach((tx) => {
    categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
  });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, total]) => ({
    category,
    total: Number(total.toFixed(2)),
    name: category,
  }));

  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return NextResponse.json({
    total,
    categoryBreakdown,
    recentTransactions,
  });
}
