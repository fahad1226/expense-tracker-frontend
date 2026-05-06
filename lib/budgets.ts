import { apiClient } from "@/config/api.client";

export type BudgetStatus = "unset" | "ok" | "warning" | "over";

export type BudgetCategoryRow = {
    categoryId: number;
    name: string;
    amount: number;
    sharePercent: number;
};

export type BudgetTopExpense = {
    id: string;
    description: string;
    categoryName: string;
    amount: number;
    date: string;
};

export type BudgetOverview = {
    month: string;
    budgetAmount: number | null;
    hasBudget: boolean;
    spent: number;
    remaining: number | null;
    percentUsed: number | null;
    status: BudgetStatus;
    daysRemainingInMonth: number | null;
    categoryBreakdown: BudgetCategoryRow[];
    topExpenses: BudgetTopExpense[];
};

/** Display label e.g. "March 2026" */
export function formatBudgetMonthLabel(yearMonth: string): string {
    const [y, m] = yearMonth.split("-").map(Number);
    if (y == null || m == null || Number.isNaN(y) || Number.isNaN(m)) {
        return yearMonth;
    }
    return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

export function currentYearMonth(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function normalizeOverview(data: BudgetOverview): BudgetOverview {
    return {
        ...data,
        budgetAmount:
            data.budgetAmount != null ? Number(data.budgetAmount) : null,
        spent: Number(data.spent),
        remaining: data.remaining != null ? Number(data.remaining) : null,
        percentUsed:
            data.percentUsed != null ? Number(data.percentUsed) : null,
        categoryBreakdown: data.categoryBreakdown.map((c) => ({
            ...c,
            amount: Number(c.amount),
            sharePercent: Number(c.sharePercent),
        })),
        topExpenses: data.topExpenses.map((e) => ({
            ...e,
            amount: Number(e.amount),
        })),
    };
}

export async function fetchBudgetOverview(month: string): Promise<BudgetOverview> {
    const { data } = await apiClient().get<BudgetOverview>("/budgets", {
        params: { month },
    });
    return normalizeOverview(data);
}

/** Persists the monthly cap and returns the refreshed overview. */
export async function saveMonthlyBudget(
    month: string,
    amount: number,
): Promise<BudgetOverview> {
    const { data } = await apiClient().put<BudgetOverview>("/budgets", {
        month,
        amount,
    });
    return normalizeOverview(data);
}
