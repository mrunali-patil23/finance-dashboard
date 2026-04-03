# Finance Dashboard

**Live Demo:** [Click here to view](https://finance-dashboard-ivory-psi.vercel.app/)

A clean, interactive finance dashboard built with React, Tailwind CSS, and Recharts.

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool (fast dev server)
- **Tailwind CSS 3** — Styling
- **Recharts** — Charts (Area, Pie, Bar)
- **Lucide React** — Icons
- **date-fns** — Date formatting
- **React Context API** — Global state management

## Features

### Dashboard
- Summary cards: Total Balance, Income, Expenses
- Area chart showing monthly income vs expense trend
- Donut chart showing spending breakdown by category
- Recent transactions list with quick "View all" link

### Transactions
- Full transaction table with date, description, category, type, amount
- Search by description
- Filter by type (Income / Expense)
- Filter by category
- Sort by date (ascending / descending)
- Empty state with clear filters prompt

### Insights
- Top spending category
- Month-over-month expense change (%)
- Average daily expense
- Savings rate
- Monthly comparison bar chart
- Category breakdown with progress bars

### Role-Based UI (RBAC)
- **Viewer** — Can view all data, no edit access
- **Admin** — Can add, edit, and delete transactions
- Switch roles using the dropdown in the sidebar

### Other
- Dark mode toggle
- Fully responsive (mobile sidebar with hamburger menu)
- Indian Rupee (₹) currency formatting
- Graceful empty states

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## Folder Structure

```
src/
  components/
    ui/               # Sidebar, Header
    dashboard/        # SummaryCards, BalanceChart, SpendingChart, RecentTransactions, DashboardPage
    transactions/     # TransactionsPage, TransactionModal
    insights/         # InsightsPage
  context/            # AppContext.jsx (global state)
  data/               # mockData.js (30 sample transactions)
  utils/              # helpers.js (formatCurrency, groupByMonth, etc.)
  App.jsx
  main.jsx
  index.css
```

## Assumptions Made

- All data is mock/static — no backend or API
- Roles are simulated on the frontend via a dropdown
- Currency is Indian Rupee (₹) as data is India-themed
- Dark mode preference is not persisted across sessions (in-memory only)
