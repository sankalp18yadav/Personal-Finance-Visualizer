import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Groceries',
        'Fuel',
        'Shopping',
        'Rent',
        'Bills',
        'Travel',
        'Medical',
        'Other'
      ],
      default: 'Other'
    },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
