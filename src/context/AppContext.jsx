import { createContext, useContext, useState, useEffect } from "react";
import { transactions as initialData } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || "viewer";
  });

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Save role whenever it changes
  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  // Save dark mode whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addTransaction = (tx) => {
    setTransactions((prev) => [{ ...tx, id: Date.now() }, ...prev]);
  };

  const editTransaction = (updated) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updated.id ? updated : tx))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        transactions,
        role,
        setRole,
        filters,
        setFilters,
        darkMode,
        toggleDarkMode,
        addTransaction,
        editTransaction,
        deleteTransaction,
      }}
    >
      <div className={darkMode ? "dark" : ""}>{children}</div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);