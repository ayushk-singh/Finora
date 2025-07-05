import { dbConnect } from "@/lib/dbConnect";
import { Budget } from "@/models/Budget";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  const { category, amount, month } = await req.json();

  if (!category || !amount || !month) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const budget = await Budget.findOneAndUpdate(
    { category, month },
    { amount },
    { new: true, upsert: true }
  );
  return NextResponse.json(budget);
}

export async function GET(req: Request) {
  await dbConnect();
  const month = new URL(req.url).searchParams.get("month");

  if (!month) return NextResponse.json({ error: "Month required" }, { status: 400 });

  const budgets = await Budget.find({ month });
  return NextResponse.json(budgets);
}
