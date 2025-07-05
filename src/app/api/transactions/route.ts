import { dbConnect } from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const data = await Transaction.find().sort({ date: -1 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  const { description, amount, date, category } = body;
  if (!description || !amount || !date || !category) {
    return NextResponse.json(
      {
        error: "All fields (description, amount, date, category) are required.",
      },
      { status: 400 }
    );
  }

  try {
    const tx = await Transaction.create({
      description,
      amount,
      date,
      category,
    });
    return NextResponse.json(tx, { status: 201 });
  } catch {
    console.error("Error creating transaction:");
    return NextResponse.json(
      { error: "Failed to create transaction." },
      { status: 500 }
    );
  }
}
