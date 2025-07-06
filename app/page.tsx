"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardSummary from "@/components/DashboardSummary";
import BudgetForm from "@/components/budget/BudgetForm";
import BudgetList from "@/components/budget/BudgetList";
import BudgetChart from "@/components/budget/BudgetChart";
import BudgetInsights from "@/components/budget/BudgetInsights";
import { Toaster } from "sonner";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[] | null>(null); // allow null for skeletons

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/budgets");
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setBudgets([]); // fallback to empty array
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  return (
    <>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 lg:space-y-12">
        {/* Transactions */}
        <section className="grid lg:grid-cols-2 gap-6">
          <TransactionForm onAdd={fetchTransactions} />
          <TransactionList transactions={transactions} onUpdate={fetchTransactions} />
        </section>

        {/* Summary */}
        <DashboardSummary transactions={transactions} />

        {/* Charts */}
        <section className="grid lg:grid-cols-2 gap-6">
          <MonthlyExpenseChart transactions={transactions} />
          <CategoryPieChart transactions={transactions} />
        </section>

        {/* Budgets */}
        <section className="space-y-6">
          <BudgetForm onAdd={fetchBudgets} />
          <BudgetList budgets={budgets} onUpdate={fetchBudgets} />
          <BudgetChart transactions={transactions} budgets={budgets} />
          <BudgetInsights transactions={transactions} budgets={budgets} />
        </section>
      </main>

      <Toaster richColors position="top-right" />
    </>
  );
}
