import { useMemo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate, getCategoryColor } from "../../utils/helpers";

export default function RecentTransactions({ onViewAll }) {
  const { transactions } = useApp();

  const recent = useMemo(() =>
    [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5),
    [transactions]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Last 5 transactions</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          View all
        </button>
      </div>

      {recent.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {recent.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(tx.category) }}
                >
                  {tx.category[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{tx.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(tx.date)} · {tx.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {tx.type === "income"
                  ? <ArrowUpRight size={14} className="text-green-500" />
                  : <ArrowDownRight size={14} className="text-red-500" />
                }
                <span className={`text-sm font-semibold ${tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
