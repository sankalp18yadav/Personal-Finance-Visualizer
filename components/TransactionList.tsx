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
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
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

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

export default function TransactionList({
  transactions,
  onUpdate,
}: {
  transactions: Transaction[];
  onUpdate: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: new Date(),
    category: "Other",
  });
  const [saving, setSaving] = useState(false);

  const startEdit = (t: Transaction) => {
    setForm({
      description: t.description,
      amount: String(t.amount),
      date: new Date(t.date),
      category: t.category || "Other",
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
          date: form.date,
          category: form.category,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Transaction updated");
      setOpenId(null);
      onUpdate(); // 🔁 refresh
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Transaction deleted");
      onUpdate();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!transactions.length) {
    return (
      <div className="bg-white/20 backdrop-blur p-4 rounded shadow text-white">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        <p>No transactions</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 space-y-4 text-white border border-white rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Transactions</h2>
      <ul className="space-y-3">
        {transactions.map((t) => (
          <li
            key={t._id}
            className="border-b pb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{t.description}</p>
              <p className="text-sm text-gray-300">
                ₹{t.amount} • {new Date(t.date).toLocaleDateString()} • {t.category}
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
              className="cursor-pointer"
              size="sm" onClick={() => startEdit(t)}>
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

            {/* Dialog for Edit */}
            <Dialog
              open={openId === t._id}
              onOpenChange={() => setOpenId(null)}
            >
              <DialogTrigger asChild></DialogTrigger>
              {openId === t._id && (
                <DialogContent className="sm:max-w-md border border-blue-500 shadow-blue-400/40 shadow-lg bg-gray-900 text-white">
                  <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <div className="space-y-1">
                      <Label>Description</Label>
                      <Input
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                      />
                    </div>

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

                    {/* Category */}
                    <div className="space-y-1">
                      <Label>Category</Label>
                      <Select
                        value={form.category}
                        onValueChange={(value) =>
                          setForm({ ...form, category: value })
                        }
                      >
                        <SelectTrigger className="bg-black text-white border border-white focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white border border-gray-600">
                          {categories.map((c) => (
                            <SelectItem
                              key={c}
                              value={c}
                              className="hover:bg-gray-800 focus:bg-white data-[state=checked]:bg-gray-700 data-[state=checked]:text-white"
                            >
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label>Date</Label>
                      <Calendar
                        mode="single"
                        selected={form.date}
                        onSelect={(d) => d && setForm({ ...form, date: d })}
                        className="rounded-md border bg-black text-white"
                      />
                      <p className="text-sm text-gray-400">
                        {format(form.date, "PPP")}
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      className="bg-black cursor-pointer"
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
