import { dbConnect } from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";
import { generateFinancialInsights } from "@/lib/aiInsight";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const transactions = await Transaction.find();

    if (transactions.length === 0) {
      return NextResponse.json({
        insight: "No transaction data available for analysis.",
      });
    }

    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    transactions.forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(
      ([category, total]) => ({
        category,
        total: Number(total.toFixed(2)),
        percentage: (total / totalSpent) * 100,
      })
    );

    // Top categories
    const topCategories = categoryBreakdown
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    // Monthly trend (simplified - last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7);

      const monthlyTotal = transactions
        .filter((tx) => tx.date.toISOString().substring(0, 7) === monthKey)
        .reduce((sum, tx) => sum + tx.amount, 0);

      monthlyTrend.push({
        month: monthKey,
        total: Number(monthlyTotal.toFixed(2)),
      });
    }

    const financialData = {
      totalSpent,
      categoryBreakdown,
      monthlyTrend,
      topCategories,
    };

    const insight = await generateFinancialInsights(financialData);

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
