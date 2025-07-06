"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const categories = [
  "Groceries",
  "Fuel",
  "Shopping",
  "Rent",
  "Bills",
  "Travel",
  "Medical",
  "Other",
];

export default function BudgetForm({ onAdd }: { onAdd?: () => void }) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amount: Number(amount), month }),
    });

    if (res.ok) {
      toast.success("✅ Budget added successfully!");
      setCategory("");
      setAmount("");
      setMonth(new Date().toISOString().slice(0, 7));
      if (onAdd) onAdd();
    } else {
      toast.error("❌ Failed to add budget.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border rounded-xl max-w-md mx-auto bg-white/10 backdrop-blur text-white"
    >
      <h2 className="text-xl font-semibold">Set Monthly Budget</h2>

      {/* Category */}
      <div className="space-y-1">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded p-2 bg-black text-white"
          required
        >
          <option value="">Select</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div className="space-y-1">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="bg-black text-white"
        />
      </div>

      {/* Month */}
      <div className="space-y-1">
        <Label htmlFor="month">Month</Label>
        <Input
          id="month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
          className="bg-black text-white"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full cursor-pointer">
        Save Budget
      </Button>
    </form>
  );
}
