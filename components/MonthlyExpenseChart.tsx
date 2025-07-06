"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Transaction {
  amount: number;
  date: string;
}

export default function MonthlyExpenseChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (!Array.isArray(transactions)) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error loading chart</AlertTitle>
        <AlertDescription>Invalid transaction data</AlertDescription>
      </Alert>
    );
  }

  const totals: Record<string, number> = {};
  transactions.forEach((t) => {
    const m = new Date(t.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    totals[m] = (totals[m] || 0) + t.amount;
  });

  const data = Object.entries(totals).map(([month, total]) => ({
    month,
    total,
  }));

  return (
    <Card className="bg-white/10 backdrop-blur p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Monthly Expenses
        </CardTitle>
      </CardHeader>

      <Separator className="bg-gray-600/50 my-2" />

      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#d1d5db" />
            <YAxis stroke="#d1d5db" />
            <Tooltip
              wrapperStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "0.5rem",
              }}
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
              }}
              labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
              itemStyle={{ color: "#ffffff" }}
              cursor={{ fill: "#374151" }}
            />
            <Bar dataKey="total">
              {data.map((entry, index) => {
                const prev = data[index - 1]?.total ?? entry.total;
                const color = entry.total > prev ? "#ef4444" : "#22c55e";
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
