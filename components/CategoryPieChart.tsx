"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Transaction {
  amount: number;
  category: string;
}

const COLORS = [
  "#3b82f6",
  "#f97316",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#facc15",
  "#f43f5e",
];

export default function CategoryPieChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (!transactions.length) return null;

  const totals: Record<string, number> = {};
  for (const tx of transactions) {
    const cat = tx.category || "Other";
    totals[cat] = (totals[cat] || 0) + tx.amount;
  }

  const data = Object.entries(totals).map(([category, total]) => ({
    category,
    total,
  }));

  return (
    <Card className="bg-white/10 backdrop-blur p-6 shadow-lg text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name }) => name}
              fill="#8884d8"
            >
              {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              wrapperStyle={{ backgroundColor: "transparent" }}
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                padding: "8px",
              }}
              itemStyle={{
                color: "white",
                fontWeight: "bold",
              }}
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
