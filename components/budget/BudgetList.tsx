"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

export default function BudgetList({
  budgets,
  onUpdate,
}: {
  budgets: Budget[] | null;
  onUpdate: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("🗑 Budget deleted");
      onUpdate();
    } else {
      toast.error("❌ Failed to delete budget");
    }
  };

  const handleEdit = async (id: string) => {
    const budget = budgets?.find((b) => b._id === id);
    const res = await fetch(`/api/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: budget?.category,
        month: budget?.month,
        amount: Number(editAmount),
      }),
    });
    if (res.ok) {
      toast.success("✅ Budget updated");
      setEditingId(null);
      setEditAmount("");
      onUpdate();
    } else {
      toast.error("❌ Failed to update budget");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full px-4">
        {budgets === null
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className="bg-white/10 backdrop-blur text-white p-4 space-y-3"
              >
                <Skeleton className="h-6 w-1/2 bg-white/30 rounded" />
                <Skeleton className="h-4 w-2/3 bg-white/20 rounded" />
                <Skeleton className="h-4 w-1/3 bg-white/20 rounded" />
              </Card>
            ))
          : budgets.map((budget) => (
              <Card
                key={budget._id}
                className="bg-white/20 backdrop-blur text-white shadow-lg"
              >
                <CardHeader>
                  <CardTitle>{budget.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Month: {budget.month}</p>
                  {editingId === budget._id ? (
                    <>
                      <Input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="bg-black text-white"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(budget._id)}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingId(null);
                            setEditAmount("");
                          }}
                          size="sm"
                          className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>Amount: ₹{budget.amount}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => {
                            setEditingId(budget._id);
                            setEditAmount(budget.amount.toString());
                          }}
                          size="sm"
                          className="cursor-pointer"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(budget._id)}
                          size="sm"
                          className="cursor-pointer"
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
