import SummaryCards from "./SummaryCards";
import BalanceChart from "./BalanceChart";
import SpendingChart from "./SpendingChart";
import RecentTransactions from "./RecentTransactions";

export default function DashboardPage({ onViewAllTransactions }) {
  return (
    <div className="space-y-5">
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BalanceChart />
        <SpendingChart />
      </div>
      <RecentTransactions onViewAll={onViewAllTransactions} />
    </div>
  );
}
