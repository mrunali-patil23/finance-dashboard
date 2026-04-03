export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getMonthName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

export const groupByMonth = (transactions) => {
  const grouped = {};
  transactions.forEach((t) => {
    const month = t.date.slice(0, 7);
    if (!grouped[month]) grouped[month] = { income: 0, expense: 0, month };
    if (t.type === 'income') grouped[month].income += t.amount;
    else grouped[month].expense += t.amount;
  });
  return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
};

export const groupByCategory = (transactions) => {
  const grouped = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!grouped[t.category]) grouped[t.category] = 0;
      grouped[t.category] += t.amount;
    });
  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Housing: '#8b5cf6',
  Transport: '#06b6d4',
  Entertainment: '#ec4899',
  Utilities: '#eab308',
  Health: '#22c55e',
  Shopping: '#f43f5e',
  Income: '#3b82f6',
  Other: '#94a3b8',
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
};
