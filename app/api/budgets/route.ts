import { connectDB } from "@/lib/db";
import Budget from "@/lib/models/Budget";
import { NextRequest, NextResponse } from "next/server";

// GET all budgets
export async function GET() {
  await connectDB();
  const budgets = await Budget.find().sort({ month: -1 });
  return NextResponse.json(budgets);
}

// POST new budget
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const { category, month, amount } = body;

  if (!category || !month || amount < 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const budget = await Budget.create({ category, month, amount });
  return NextResponse.json(budget);
}
