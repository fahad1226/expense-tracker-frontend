export const expenseCategories = [
  { value: "food", label: "Food & Dining" },
  { value: "transport", label: "Transportation" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "bills", label: "Bills & Utilities" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "travel", label: "Travel" },
  { value: "other", label: "Other" },
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number]["value"];

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
}

export const mockExpenses: Expense[] = [
  {
    id: "1",
    amount: 125.5,
    category: "food",
    description: "Grocery shopping at Whole Foods",
    date: "2025-02-11",
  },
  {
    id: "2",
    amount: 24.0,
    category: "transport",
    description: "Uber ride to downtown",
    date: "2025-02-11",
  },
  {
    id: "3",
    amount: 15.99,
    category: "entertainment",
    description: "Netflix subscription",
    date: "2025-02-10",
  },
  {
    id: "4",
    amount: 5.5,
    category: "food",
    description: "Morning coffee",
    date: "2025-02-10",
  },
  {
    id: "5",
    amount: 32.99,
    category: "shopping",
    description: "Book purchase - Design patterns",
    date: "2025-02-09",
  },
  {
    id: "6",
    amount: 89.0,
    category: "bills",
    description: "Electric bill",
    date: "2025-02-08",
  },
  {
    id: "7",
    amount: 45.0,
    category: "healthcare",
    description: "Pharmacy - vitamins",
    date: "2025-02-07",
  },
  {
    id: "8",
    amount: 12.0,
    category: "food",
    description: "Lunch at cafe",
    date: "2025-02-07",
  },
  {
    id: "9",
    amount: 250.0,
    category: "education",
    description: "Online course subscription",
    date: "2025-02-05",
  },
  {
    id: "10",
    amount: 180.0,
    category: "travel",
    description: "Hotel booking",
    date: "2025-02-04",
  },
];

export function getCategoryLabel(value: ExpenseCategory): string {
  return expenseCategories.find((c) => c.value === value)?.label ?? value;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
