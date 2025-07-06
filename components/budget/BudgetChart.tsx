"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface Budget {
  category: string;
  amount: number;
  month: string;
}

interface Props {
  transactions: Transaction[];
  budgets: Budget[] | null;
}

export default function BudgetChart({ transactions, budgets }: Props) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const categorySpent = useMemo(() => {
    const spent: Record<string, number> = {};
    transactions.forEach((t) => {
      const cat = t.category || "Uncategorized";
      spent[cat] = (spent[cat] || 0) + t.amount;
    });
    return spent;
  }, [transactions]);

  const data = useMemo(() => {
    if (!budgets) return [];
    return budgets
      .filter((b) => b.month === currentMonth)
      .map((b) => ({
        category: b.category,
        budget: b.amount,
        spent: categorySpent[b.category] || 0,
      }));
  }, [budgets, currentMonth, categorySpent]);

  if (!budgets) {
    return <Skeleton className="w-full h-96 rounded-xl bg-white/10" />;
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#34d399" name="Budget" />
          <Bar dataKey="spent" fill="#f87171" name="Spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
