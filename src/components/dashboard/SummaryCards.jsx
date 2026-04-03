import { useMemo } from "react";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/helpers";

export default function SummaryCards() {
  const { transactions } = useApp();

  const summary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const cards = [
    {
      title: "Total Balance",
      value: formatCurrency(summary.balance),
      icon: Wallet,
      bg: "bg-blue-600",
      light: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      change: "+2.5% from last month",
      positive: true,
    },
    {
      title: "Total Income",
      value: formatCurrency(summary.income),
      icon: TrendingUp,
      bg: "bg-green-500",
      light: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
      change: "+8.2% from last month",
      positive: true,
    },
    {
      title: "Total Expenses",
      value: formatCurrency(summary.expense),
      icon: TrendingDown,
      bg: "bg-red-500",
      light: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
      change: "+3.1% from last month",
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.light} p-2.5 rounded-xl`}>
                <Icon className={card.text} size={20} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${card.positive ? "text-green-600" : "text-red-500"}`}>
                <ArrowUpRight size={12} className={card.positive ? "" : "rotate-180"} />
                {card.change.split(" ")[0]}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.change}</p>
          </div>
        );
      })}
    </div>
  );
}
