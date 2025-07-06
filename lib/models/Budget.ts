import { Schema, model, models } from "mongoose";

const BudgetSchema = new Schema(
  {
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
      required: true
    },
    month: {
      type: String,
      required: true, // Format: "YYYY-MM" (e.g., "2025-07")
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

export default models.Budget || model("Budget", BudgetSchema);
