"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  amount: number;
  description: string;
  category: string;
  date: string;
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

export default function BudgetInsights({ transactions, budgets }: Props) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  if (!budgets) {
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-6 w-48 bg-white/10 rounded" />
        <Skeleton className="h-20 bg-white/10 rounded" />
        <Skeleton className="h-20 bg-white/10 rounded" />
      </div>
    );
  }

  const categorySpent: Record<string, number> = {};
  transactions.forEach((t) => {
    const cat = t.category || "Uncategorized";
    categorySpent[cat] = (categorySpent[cat] || 0) + t.amount;
  });

  const insights = budgets
    .filter((b) => b.month === currentMonth)
    .map((b) => {
      const spent = categorySpent[b.category] || 0;
      const percent = ((spent / b.amount) * 100).toFixed(0);
      const diff = spent - b.amount;
      return {
        category: b.category,
        spent,
        budget: b.amount,
        status:
          diff > 0
            ? `Over budget by ₹${diff}`
            : `Under budget by ₹${-diff}`,
        percentUsed: percent,
      };
    });

  return (
    <div className="space-y-2 p-4">
      <h2 className="text-xl font-semibold mb-2 text-white">Spending Insights</h2>
      {insights.map((i) => (
        <div key={i.category} className="p-2 border rounded-xl bg-white/10 text-white">
          <p>
            <strong>{i.category}</strong>: {i.status} (Used {i.percentUsed}%)
          </p>
        </div>
      ))}
    </div>
  );
}
