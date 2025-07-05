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
  const tx = await Transaction.create(body);
  return NextResponse.json(tx, { status: 201 });
}
