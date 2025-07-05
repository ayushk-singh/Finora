import { dbConnect } from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const data = await req.json();
  const { id } = await context.params;

  const updated = await Transaction.findByIdAndUpdate(id, data, { new: true });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;
  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
