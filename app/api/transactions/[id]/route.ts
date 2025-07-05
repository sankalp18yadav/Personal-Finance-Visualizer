import { connectDB } from "@/lib/db";
import Transaction from "@/lib/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

// PUT: update a transaction
export async function PUT(req: NextRequest, context: { params: any }) {
  const id = context.params.id;
  await connectDB();

  try {
    const body = await req.json();

    const updated = await Transaction.findByIdAndUpdate(
      id,
      {
        description: body.description,
        amount: body.amount,
        date: body.date,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("🔥 PUT /api/transactions/[id] error:", msg);
    return NextResponse.json({ error: "Failed to update", message: msg }, { status: 500 });
  }
}

// DELETE: remove a transaction
export async function DELETE(
  _req: NextRequest,
  context: { params: any }
) {
  const id = context.params.id;
  await connectDB();

  try {
    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("🔥 DELETE /api/transactions/[id] error:", msg);
    return NextResponse.json({ error: "Failed to delete", message: msg }, { status: 500 });
  }
}
