import { dbConnect } from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";
import { Budget } from "@/models/Budget";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();

  const monthParam = new URL(req.url).searchParams.get("month");
  if (!monthParam) {
    return NextResponse.json(
      { error: "Month is required in YYYY-MM format" },
      { status: 400 }
    );
  }

  const [yearStr, monthStr] = monthParam.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const transactions = await Transaction.find({
    date: { $gte: start, $lt: end },
  });

  const budgets = await Budget.find({ month: monthParam });

  const actuals: Record<string, number> = {};
  for (const tx of transactions) {
    actuals[tx.category] = (actuals[tx.category] || 0) + tx.amount;
  }

  const allCategories = new Set([
    ...budgets.map((b) => b.category),
    ...transactions.map((t) => t.category),
  ]);

  const comparison = Array.from(allCategories).map((category) => {
    const budgeted = budgets.find((b) => b.category === category)?.amount || 0;
    const actual = actuals[category] || 0;

    return {
      category,
      budgeted: +budgeted.toFixed(2),
      actual: +actual.toFixed(2),
    };
  });

  return NextResponse.json(comparison);
}
