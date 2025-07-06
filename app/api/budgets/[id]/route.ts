import { connectDB } from "@/lib/db";
import Budget from "@/lib/models/Budget";
import { NextRequest, NextResponse } from "next/server";

// PUT update budget
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  await connectDB();
  const { category, month, amount } = await req.json();

  const updated = await Budget.findByIdAndUpdate(
    id,
    { category, month, amount },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE budget
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  await connectDB();

  const deleted = await Budget.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
