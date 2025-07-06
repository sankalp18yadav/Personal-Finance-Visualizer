"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

export default function TransactionForm({ onAdd }: { onAdd: () => void }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: new Date(),
    category: "Other",
  });

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(form.amount),
          description: form.description,
          date: form.date,
          category: form.category,
        }),
      });

      if (!res.ok) throw new Error("Server error");

      toast.success("Transaction added ✔");
      setForm({
        amount: "",
        description: "",
        date: new Date(),
        category: "Other",
      });
      onAdd(); // 🔁 Refresh transaction list & chart
    } catch {
      toast.error("Failed to add transaction");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="bg-white/20 backdrop-blur p-6 space-y-4 shadow-lg text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div className="space-y-1">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            disabled={submitting}
            min={1}
            type="number"
            placeholder="₹"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            disabled={submitting}
            placeholder="e.g. Grocery"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(value) => setForm({ ...form, category: value })}
          >
            <SelectTrigger className="bg-black text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="hover:bg-[#1b1b1b] text-white">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-1">
          <Label>Date</Label>
          <Calendar
            mode="single"
            selected={form.date}
            onSelect={(d) => d && setForm({ ...form, date: d })}
            className="rounded-md border bg-gray-800"
          />
          <p className="text-sm text-gray-300">{format(form.date, "PPP")}</p>
        </div>

        {/* Submit */}
        <Button disabled={submitting} className="w-full cursor-pointer">
          {submitting ? "Saving…" : "Add Transaction"}
        </Button>
      </form>
    </Card>
  );
}
