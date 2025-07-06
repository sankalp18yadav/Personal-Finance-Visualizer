import { connectDB } from "@/lib/db";
import Budget from "@/lib/models/Budget";
import { NextRequest, NextResponse } from "next/server";

// PUT: Update budget by ID
export async function PUT(req: NextRequest, context: any) {
  const id = context.params.id;

  await connectDB();

  try {
    const body = await req.json();
    const { category, month, amount } = body;

    const updated = await Budget.findByIdAndUpdate(
      id,
      { category, month, amount },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("🔥 PUT /api/budgets/[id] error:", msg);
    return NextResponse.json(
      { error: "Failed to update budget", message: msg },
      { status: 500 }
    );
  }
}

// DELETE: Delete budget by ID
export async function DELETE(_req: NextRequest, context: any) {
  const id = context.params.id;

  await connectDB();

  try {
    const deleted = await Budget.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("🔥 DELETE /api/budgets/[id] error:", msg);
    return NextResponse.json(
      { error: "Failed to delete budget", message: msg },
      { status: 500 }
    );
  }
}
