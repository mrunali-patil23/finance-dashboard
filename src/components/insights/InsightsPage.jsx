import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Award, Calendar, DollarSign, Target } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, groupByMonth, groupByCategory, getCategoryColor } from "../../utils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }} className="font-medium">
            {entry.name}: ₹{entry.value.toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function InsightsPage() {
  const { transactions } = useApp();

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const incomes = transactions.filter((t) => t.type === "income");

    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);

    // Highest spending category
    const byCategory = groupByCategory(transactions);
    const topCategory = byCategory[0] || { name: "N/A", value: 0 };

    // Monthly data
    const monthly = groupByMonth(transactions);
    const lastTwo = monthly.slice(-2);
    const prevMonth = lastTwo[0];
    const currMonth = lastTwo[1];

    let monthChange = 0;
    if (prevMonth && currMonth && prevMonth.expense > 0) {
      monthChange = ((currMonth.expense - prevMonth.expense) / prevMonth.expense) * 100;
    }

    // Average daily expense
    const uniqueDays = new Set(expenses.map((t) => t.date)).size;
    const avgDaily = uniqueDays > 0 ? totalExpense / uniqueDays : 0;

    // Savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return { topCategory, monthChange, avgDaily, savingsRate, totalExpense, totalIncome, monthly, byCategory };
  }, [transactions]);

  const statCards = [
    {
      title: "Top Spending Category",
      value: insights.topCategory.name,
      sub: formatCurrency(insights.topCategory.value) + " spent",
      icon: Award,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      dot: getCategoryColor(insights.topCategory.name),
    },
    {
      title: "Month-over-Month Change",
      value: `${insights.monthChange >= 0 ? "+" : ""}${insights.monthChange.toFixed(1)}%`,
      sub: insights.monthChange >= 0 ? "Expenses increased" : "Expenses decreased",
      icon: insights.monthChange >= 0 ? TrendingUp : TrendingDown,
      color: insights.monthChange >= 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400",
      bg: insights.monthChange >= 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Average Daily Expense",
      value: formatCurrency(Math.round(insights.avgDaily)),
      sub: "Per day average",
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Savings Rate",
      value: `${insights.savingsRate.toFixed(1)}%`,
      sub: `${formatCurrency(insights.totalIncome - insights.totalExpense)} saved`,
      icon: Target,
      color: insights.savingsRate >= 20 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400",
      bg: insights.savingsRate >= 20 ? "bg-green-50 dark:bg-green-900/20" : "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className={`${card.bg} p-2.5 rounded-xl w-fit mb-3`}>
                <Icon className={card.color} size={18} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly comparison bar chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Monthly Comparison</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Income vs Expenses per month</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={insights.monthly} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown list */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Spending by Category</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">All time breakdown</p>
        </div>
        <div className="space-y-3">
          {insights.byCategory.map((cat) => {
            const pct = insights.totalExpense > 0 ? (cat.value / insights.totalExpense) * 100 : 0;
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(cat.name) }} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{pct.toFixed(1)}%</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(cat.value)}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: getCategoryColor(cat.name) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
