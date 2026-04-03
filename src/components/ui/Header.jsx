import { Menu, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Header({ activeTab, setMobileOpen }) {
  const { role } = useApp();

  const titles = {
    dashboard: "Dashboard",
    transactions: "Transactions",
    insights: "Insights",
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">{titles[activeTab]}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            Welcome back! Here's your financial overview.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
          ${role === "admin"
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
          }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {role === "admin" ? "Admin" : "Viewer"}
        </span>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">M</span>
        </div>
      </div>
    </header>
  );
}
