"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import { Toaster } from "sonner";

export default function Home() {
  const [transactions, setTransactions] = useState([]);

  async function fetchTransactions() {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 lg:space-y-12">
        <section className="grid lg:grid-cols-2 gap-6">
          <TransactionForm onAdd={fetchTransactions} />
          <TransactionList transactions={transactions} onUpdate={fetchTransactions} />
        </section>

        <MonthlyExpenseChart transactions={transactions} />
      </main>

      <Toaster richColors position="top-right" />
    </>
  );
}
