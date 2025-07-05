import  { dbConnect }  from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "MongoDB connected" });
  } catch (error) {
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}
