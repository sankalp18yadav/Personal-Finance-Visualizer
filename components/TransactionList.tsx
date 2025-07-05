"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
}

export default function TransactionList({
  transactions,
  onUpdate
}: {
  transactions: Transaction[];
  onUpdate: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: new Date()
  });
  const [saving, setSaving] = useState(false);

  const startEdit = (t: Transaction) => {
    setForm({
      description: t.description,
      amount: String(t.amount),
      date: new Date(t.date)
    });
    setOpenId(t._id);
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description,
          amount: parseFloat(form.amount),
          date: form.date
        })
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Transaction updated");
      setOpenId(null);
      onUpdate();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Transaction deleted");
      onUpdate();
    } catch {
      toast.error("Delete failed");
    }
  }

  if (!transactions.length) {
    return (
      <div className="bg-white/20 backdrop-blur p-4 rounded shadow text-white">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        <p>No transactions</p>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur p-4 rounded shadow text-white">
      <h2 className="text-lg font-semibold mb-4">Transactions</h2>
      <ul className="space-y-3">
        {transactions.map((t) => (
          <li
            key={t._id}
            className="border-b pb-2 flex justify-between items-center flex-wrap gap-4"
          >
            <div>
              <p>{t.description}</p>
              <p className="text-sm text-gray-300">
                ₹{t.amount} • {new Date(t.date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => startEdit(t)}>
                Edit
              </Button>
              <Button
              className="cursor-pointer"
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(t._id)}
              >
                Delete
              </Button>
            </div>

            {/* ----- Dialog ----- */}
            <Dialog open={openId === t._id} onOpenChange={() => setOpenId(null)}>
              <DialogTrigger asChild></DialogTrigger>

              {openId === t._id && (
                <DialogContent
                  className="sm:max-w-md bg-[#232323] text-white shadow-xl border border-blue-500/30 shadow-blue-500/30"
                >
                  <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    {/* Description */}
                    <div className="space-y-1">
                      <Label>Description</Label>
                      <Input
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                      />
                    </div>

                    {/* Amount */}
                    <div className="space-y-1">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={form.amount}
                        onChange={(e) =>
                          setForm({ ...form, amount: e.target.value })
                        }
                      />
                    </div>

                    {/* Date */}
                    <div className="space-y-1">
                      <Label>Date</Label>
                      <Calendar
                        mode="single"
                        selected={form.date}
                        onSelect={(d) => d && setForm({ ...form, date: d })}
                        className="rounded-md border bg-gray-800 text-white"
                      />
                      <p className="text-sm text-gray-400">
                        {format(form.date, "PPP")}
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                    className="cursor-pointer"
                      onClick={() => handleSave(t._id)}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>
          </li>
        ))}
      </ul>
    </div>
  );
}
