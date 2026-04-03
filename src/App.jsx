import { useState } from "react";
import Sidebar from "./components/ui/Sidebar";
import Header from "./components/ui/Header";
import DashboardPage from "./components/dashboard/DashboardPage";
import TransactionsPage from "./components/transactions/TransactionsPage";
import InsightsPage from "./components/insights/InsightsPage";
import { useApp } from "./context/AppContext";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode } = useApp();

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage onViewAllTransactions={() => setActiveTab("transactions")} />;
      case "transactions":
        return <TransactionsPage />;
      case "insights":
        return <InsightsPage />;
      default:
        return <DashboardPage onViewAllTransactions={() => setActiveTab("transactions")} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-950`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content - offset by sidebar width on desktop */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        <Header activeTab={activeTab} setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 md:p-6">
          {renderPage()}
        </main>
        <footer className="text-center text-xs text-gray-400 dark:text-gray-600 py-4">
          Finance Dashboard © 2025 — Built with React + Tailwind + Recharts
        </footer>
      </div>
    </div>
  );
}
