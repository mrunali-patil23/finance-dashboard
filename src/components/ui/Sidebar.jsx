import { LayoutDashboard, ArrowLeftRight, Lightbulb, Sun, Moon, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const { role, setRole, darkMode, toggleDarkMode } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">FD</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">FinDash</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Finance Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${activeTab === id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <Icon size={18} />
              {label}
              {activeTab === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-4 pb-6 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Role selector */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-1 font-medium uppercase tracking-wide">Role</p>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${role === "admin" ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role} access</span>
            </div>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
              text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>
    </>
  );
}
