"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";

export default function TransactionForm({ onAdd }: { onAdd: () => void }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: new Date()
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
          date: form.date
        })
      });

      if (!res.ok) throw new Error("Server error");

      toast.success("Transaction added ✔");
      setForm({ amount: "", description: "", date: new Date() });

      onAdd(); // 🔁 Refresh transaction list + chart
    } catch {
      toast.error("Failed to add transaction");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="bg-white/20 backdrop-blur p-6 space-y-4 shadow-lg text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            disabled={submitting}
            type="number"
            placeholder="₹"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            disabled={submitting}
            placeholder="e.g. Grocery"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label>Date</Label>
          <Calendar
            mode="single"
            selected={form.date}
            onSelect={d => d && setForm({ ...form, date: d })}
            className="rounded-md border bg-gray-800"
          />
          <p className="text-sm text-gray-300">
            {format(form.date, "PPP")}
          </p>
        </div>

        <Button disabled={submitting} className="w-full cursor-pointer">
          {submitting ? "Saving…" : "Add Transaction"}
        </Button>
      </form>
    </Card>
  );
}
