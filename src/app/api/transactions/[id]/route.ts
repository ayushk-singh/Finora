import { dbConnect } from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await req.json();
  const updated = await Transaction.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  await Transaction.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
