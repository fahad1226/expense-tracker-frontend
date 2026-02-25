export const expenseCategories = [
    { id: 1, value: "food", label: "Food & Dining" },
    { id: 2, value: "transport", label: "Transportation" },
    { id: 3, value: "shopping", label: "Shopping" },
    { id: 4, value: "entertainment", label: "Entertainment" },
    { id: 5, value: "bills", label: "Bills & Utilities" },
    { id: 6, value: "healthcare", label: "Healthcare" },
    { id: 7, value: "education", label: "Education" },
    { id: 8, value: "travel", label: "Travel" },
    { id: 9, value: "other", label: "Other" },
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number]["value"];

export interface Expense {
    id: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    description: string;
}

/** Helper to format YYYY-MM-DD from a Date */
export function toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/**
 * Generates dummy expense data for the current month and previous month.
 * Uses local dates so charts always show data regardless of system date/timezone.
 */
function generateMockExpenses(): Expense[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    const entries: Omit<Expense, "date">[] = [
        { id: "1", amount: 125.5, category: "food", description: "Grocery shopping at Whole Foods" },
        { id: "2", amount: 24.0, category: "transport", description: "Uber ride to downtown" },
        { id: "3", amount: 89.0, category: "bills", description: "Electric bill" },
        { id: "4", amount: 45.0, category: "healthcare", description: "Pharmacy - vitamins" },
        { id: "5", amount: 12.0, category: "food", description: "Lunch at cafe" },
        { id: "6", amount: 250.0, category: "education", description: "Online course subscription" },
        { id: "7", amount: 180.0, category: "travel", description: "Hotel booking" },
        { id: "8", amount: 35.0, category: "transport", description: "Gas station" },
        { id: "9", amount: 18.5, category: "food", description: "Restaurant dinner" },
        { id: "10", amount: 15.99, category: "entertainment", description: "Netflix subscription" },
        { id: "11", amount: 5.5, category: "food", description: "Morning coffee" },
        { id: "12", amount: 32.99, category: "shopping", description: "Book purchase - Design patterns" },
        { id: "13", amount: 42.0, category: "food", description: "Weekly groceries" },
        { id: "14", amount: 28.0, category: "transport", description: "Lyft to airport" },
        { id: "15", amount: 120.0, category: "bills", description: "Internet bill" },
        { id: "16", amount: 55.0, category: "shopping", description: "Office supplies" },
        { id: "17", amount: 22.0, category: "entertainment", description: "Movie tickets" },
        { id: "18", amount: 95.0, category: "food", description: "Dinner out" },
        { id: "19", amount: 78.0, category: "healthcare", description: "Doctor visit" },
        { id: "20", amount: 15.0, category: "food", description: "Brunch" },
        { id: "21", amount: 199.0, category: "shopping", description: "New headphones" },
        { id: "22", amount: 65.0, category: "transport", description: "Car maintenance" },
        { id: "23", amount: 12.99, category: "entertainment", description: "Spotify subscription" },
        { id: "24", amount: 88.0, category: "food", description: "Costco run" },
        { id: "25", amount: 150.0, category: "bills", description: "Phone bill" },
        { id: "26", amount: 45.0, category: "education", description: "Udemy course" },
        { id: "27", amount: 8.5, category: "food", description: "Coffee and pastry" },
        { id: "28", amount: 19.0, category: "transport", description: "Bus pass" },
        { id: "29", amount: 35.0, category: "other", description: "Miscellaneous" },
    ];

    // Current month: spread across 4 weeks (days 1, 5, 8, 12, 15, 18, 22, 25)
    const currentMonthDates = [1, 5, 8, 12, 15, 18, 22, 25];
    const currentMonthExpenses = entries.slice(0, 29).map((e, i) => ({
        ...e,
        date: toISODate(new Date(year, month, Math.min(currentMonthDates[Math.floor(i / 4)] ?? 1, 28))),
    }));

    // Previous month: 3 expenses for trend comparison
    const prevMonthExpenses: Expense[] = [
        { ...entries[0]!, id: "30", date: toISODate(new Date(prevYear, prevMonth, 15)) },
        { ...entries[2]!, id: "31", date: toISODate(new Date(prevYear, prevMonth, 10)) },
        { ...entries[1]!, id: "32", date: toISODate(new Date(prevYear, prevMonth, 8)) },
    ].map(({ id, amount, category, description, date }) => ({ id, amount, category, description, date }));

    return [...currentMonthExpenses, ...prevMonthExpenses];
}

export const mockExpenses: Expense[] = generateMockExpenses();

export function getCategoryLabel(value: ExpenseCategory): string {
    return expenseCategories.find((c) => c.value === value)?.label ?? value;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
    food: "bg-amber-100 text-amber-800",
    transport: "bg-blue-100 text-blue-800",
    shopping: "bg-violet-100 text-violet-800",
    entertainment: "bg-pink-100 text-pink-800",
    bills: "bg-slate-100 text-slate-800",
    healthcare: "bg-emerald-100 text-emerald-800",
    education: "bg-indigo-100 text-indigo-800",
    travel: "bg-cyan-100 text-cyan-800",
    other: "bg-gray-100 text-gray-800",
};

export function getCategoryColor(value: ExpenseCategory): string {
    return CATEGORY_COLORS[value] ?? CATEGORY_COLORS.other;
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
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
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
