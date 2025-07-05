import { connectDB } from "@/lib/db";
import Transaction from "@/lib/models/Transaction";
import { NextResponse } from "next/server";

// ✅ PUT /api/transactions/[id] — update transaction
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const data = await req.json();

  try {
    const updated = await Transaction.findByIdAndUpdate(
      params.id,
      {
        description: data.description,
        amount: data.amount,
        date: data.date,
      },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/transactions/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    await Transaction.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
