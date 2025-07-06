import { connectDB } from "@/lib/db";
import Transaction from "@/lib/models/Transaction";
import { NextResponse } from "next/server";

// GET all transactions
export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to fetch", message: errorMessage }, { status: 500 });
  }
}

// POST new transaction
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { amount, description, date, category } = body;

    if (!amount || !description || !date || !category) {
      return NextResponse.json(
        { error: "Missing required fields: amount, description, date, category" },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    const parsedDate = new Date(date);

    const transaction = await Transaction.create({
      amount: parsedAmount,
      description,
      date: parsedDate,
      category, // ✅ make sure this is passed
    });

    console.log("✅ Created transaction:", transaction); // ✅ log to verify

    return NextResponse.json(transaction);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to create transaction", message: errorMessage },
      { status: 500 }
    );
  }
}