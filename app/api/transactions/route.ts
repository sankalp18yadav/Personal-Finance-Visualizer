import { connectDB } from "@/lib/db";
import Transaction from "@/lib/models/Transaction";
import { NextResponse } from "next/server";

// ✅ GET all transactions
export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("🔥 GET /api/transactions error:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch transactions", message: errorMessage },
      { status: 500 }
    );
  }
}

// ✅ POST a new transaction
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { amount, description, date } = body;

    if (!amount || !description || !date) {
      return NextResponse.json(
        { error: "Missing required fields: amount, description, date" },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const transaction = await Transaction.create({
      amount: parsedAmount,
      description,
      date: parsedDate,
    });

    return NextResponse.json(transaction);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("🔥 POST /api/transactions error:", errorMessage);

    return NextResponse.json(
      { error: "Failed to create transaction", message: errorMessage },
      { status: 500 }
    );
  }
}
