"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  amount: number;
  category: string;
  description: string;
  date: string;
}

export default function DashboardSummary({ transactions }: { transactions: Transaction[] }) {
  if (!transactions.length) return null;

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const categoryCounts: Record<string, number> = {};
  for (const tx of transactions) {
    const cat = tx.category || "Other";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  const mostUsedCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const latestTx = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-white/10 backdrop-blur shadow text-white">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-green-500">₹{total}</p>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur shadow text-white">
        <CardHeader>
          <CardTitle>Top Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl">{mostUsedCategory}</p>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur shadow text-white">
        <CardHeader>
          <CardTitle>Latest Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{latestTx.description}</p>
          <p className="text-sm text-gray-300"><span className="text-green-600">₹{latestTx.amount}</span> • {new Date(latestTx.date).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </section>
  );
}
