"use client";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
}

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-white/20 backdrop-blur p-4 rounded shadow-md text-white">
      <h2 className="text-lg font-semibold mb-2">Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions yet.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((t) => (
            <li key={t._id} className="flex justify-between items-center border-b border-gray-600 pb-1">
              <div>
                <p className="font-medium">{t.description}</p>
                <p className="text-sm text-gray-400">
                  {new Date(t.date).toLocaleDateString()}
                </p>
              </div>
              <div className="font-bold text-green-400">₹{t.amount}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
