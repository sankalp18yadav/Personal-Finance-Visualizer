import { connectDB } from "@/lib/db";
import Transaction from "@/lib/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

// ✅ PUT: Update a transaction
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await connectDB();

  try {
    const data = await req.json();

    const updated = await Transaction.findByIdAndUpdate(
      id,
      {
        description: data.description,
        amount: data.amount,
        date: data.date,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("🔥 PUT /api/transactions/[id] error:", message);
    return NextResponse.json({ error: "Failed to update", message }, { status: 500 });
  }
}

// ✅ DELETE: Remove a transaction
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await connectDB();

  try {
    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("🔥 DELETE /api/transactions/[id] error:", message);
    return NextResponse.json({ error: "Failed to delete", message }, { status: 500 });
  }
}
