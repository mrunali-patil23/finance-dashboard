import { useMemo, useState } from "react";
import { Search, Filter, Plus, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate, getCategoryColor } from "../../utils/helpers";
import { categories } from "../../data/mockData";
import TransactionModal from "./TransactionModal";

export default function TransactionsPage() {
  const { transactions, filters, setFilters, role, deleteTransaction } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => t.description.toLowerCase().includes(filters.search.toLowerCase()))
      .filter((t) => filters.type === "all" || t.type === filters.type)
      .filter((t) => filters.category === "all" || t.category === filters.category)
      .sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date)
      );
  }, [transactions, filters, sortOrder]);

  const openAdd = () => { setEditData(null); setModalOpen(true); };
  const openEdit = (tx) => { setEditData(tx); setModalOpen(true); };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {/* Type filter */}
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* Category filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Sort */}
            <button
              onClick={() => setSortOrder((s) => s === "desc" ? "asc" : "desc")}
              className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowUpDown size={15} />
            </button>

            {/* Clear filters */}
            {(filters.search || filters.type !== "all" || filters.category !== "all") && (
              <button
                onClick={() => setFilters({ search: "", type: "all", category: "all" })}
                className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-900 text-xs text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Clear
              </button>
            )}
          </div>

          {/* Add button - Admin only */}
          {role === "admin" && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
                text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Plus size={15} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500 dark:text-gray-400 px-1">
        Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filtered.length}</span> of {transactions.length} transactions
      </p>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Filter size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No transactions found</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
            <button
              onClick={() => setFilters({ search: "", type: "all", category: "all" })}
              className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  {["Date", "Description", "Category", "Type", "Amount", ...(role === "admin" ? ["Actions"] : [])].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                      ${i % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/50"}`}
                  >
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(tx.date)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(tx.category) }}
                        >
                          {tx.category[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-lg font-medium text-white"
                        style={{ backgroundColor: getCategoryColor(tx.category) }}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium capitalize
                        ${tx.type === "income"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold whitespace-nowrap
                      ${tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(tx)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
      />
    </div>
  );
}
