import { apiClient } from "@/config/api.client";

export type BudgetStatus = "unset" | "ok" | "warning" | "over";
export type BudgetLifecycleStatus = "upcoming" | "active" | "expired";
export type BudgetPeriodType = "monthly" | "weekly" | "yearly" | "custom";

export type BudgetCategoryInfo = {
    id: number;
    name: string;
    icon: string | null;
};

export type CategoryBudget = {
    id: number;
    category: BudgetCategoryInfo;
    amount: number;
    spent: number;
    remaining: number;
    percentUsed: number | null;
    status: Exclude<BudgetStatus, "unset">;
    lifecycleStatus: BudgetLifecycleStatus;
    periodType: BudgetPeriodType;
    startsAt: string;
    endsAt: string;
    note: string | null;
    daysRemaining: number | null;
};

export type CategoryBudgetImpact = {
    budgetId: number;
    category: BudgetCategoryInfo;
    amount: number;
    spent: number;
    projectedSpent: number;
    remaining: number;
    projectedRemaining: number;
    currentStatus: Exclude<BudgetStatus, "unset">;
    projectedStatus: Exclude<BudgetStatus, "unset">;
    periodType: BudgetPeriodType;
    startsAt: string;
    endsAt: string;
};

export type CategoryBudgetCheckResult = {
    impacts: CategoryBudgetImpact[];
};

export type CreateCategoryBudgetInput = {
    categoryId: number;
    amount: number;
    periodType: BudgetPeriodType;
    referenceMonth?: string;
    referenceYear?: number;
    startsAt?: string;
    endsAt?: string;
    note?: string | null;
};

export type UpdateCategoryBudgetInput = Partial<CreateCategoryBudgetInput>;

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

function normalizeCategoryBudget(data: CategoryBudget): CategoryBudget {
    return {
        ...data,
        amount: Number(data.amount),
        spent: Number(data.spent),
        remaining: Number(data.remaining),
        percentUsed:
            data.percentUsed != null ? Number(data.percentUsed) : null,
    };
}

function toCreatePayload(input: CreateCategoryBudgetInput) {
    return {
        category_id: input.categoryId,
        amount: input.amount,
        period_type: input.periodType,
        reference_month: input.referenceMonth,
        reference_year: input.referenceYear,
        starts_at: input.startsAt,
        ends_at: input.endsAt,
        note: input.note,
    };
}

function toUpdatePayload(input: UpdateCategoryBudgetInput) {
    return {
        ...(input.categoryId != null
            ? { category_id: input.categoryId }
            : {}),
        ...(input.amount != null ? { amount: input.amount } : {}),
        ...(input.periodType != null
            ? { period_type: input.periodType }
            : {}),
        ...(input.referenceMonth != null
            ? { reference_month: input.referenceMonth }
            : {}),
        ...(input.referenceYear != null
            ? { reference_year: input.referenceYear }
            : {}),
        ...(input.startsAt != null ? { starts_at: input.startsAt } : {}),
        ...(input.endsAt != null ? { ends_at: input.endsAt } : {}),
        ...(input.note !== undefined ? { note: input.note } : {}),
    };
}

export async function fetchCategoryBudgets(): Promise<CategoryBudget[]> {
    const { data } = await apiClient().get<{ data: CategoryBudget[] }>(
        "/category-budgets",
    );
    return data.data.map(normalizeCategoryBudget);
}

export async function createCategoryBudget(
    input: CreateCategoryBudgetInput,
): Promise<CategoryBudget> {
    const { data } = await apiClient().post<{ data: CategoryBudget }>(
        "/category-budgets",
        toCreatePayload(input),
    );
    return normalizeCategoryBudget(data.data);
}

export async function updateCategoryBudget(
    id: number,
    input: UpdateCategoryBudgetInput,
): Promise<CategoryBudget> {
    const { data } = await apiClient().put<{ data: CategoryBudget }>(
        `/category-budgets/${id}`,
        toUpdatePayload(input),
    );
    return normalizeCategoryBudget(data.data ?? data);
}

export async function deleteCategoryBudget(id: number): Promise<void> {
    await apiClient().delete(`/category-budgets/${id}`);
}

export async function checkCategoryBudgetImpact(input: {
    categoryId: number;
    amount: number;
    date: string;
}): Promise<CategoryBudgetCheckResult> {
    const { data } = await apiClient().post<CategoryBudgetCheckResult>(
        "/category-budgets/check",
        {
            category_id: input.categoryId,
            amount: input.amount,
            date: input.date,
        },
    );

    return {
        impacts: data.impacts.map((impact) => ({
            ...impact,
            amount: Number(impact.amount),
            spent: Number(impact.spent),
            projectedSpent: Number(impact.projectedSpent),
            remaining: Number(impact.remaining),
            projectedRemaining: Number(impact.projectedRemaining),
        })),
    };
}

export function formatBudgetPeriodLabel(budget: CategoryBudget): string {
    const periodLabels: Record<BudgetPeriodType, string> = {
        monthly: "Monthly",
        weekly: "Weekly",
        yearly: "Yearly",
        custom: "Custom",
    };

    const start = new Date(`${budget.startsAt}T00:00:00`);
    const end = new Date(`${budget.endsAt}T00:00:00`);

    if (budget.periodType === "monthly") {
        return `${start.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        })} · ${periodLabels[budget.periodType]}`;
    }

    if (budget.periodType === "yearly") {
        return `${start.getFullYear()} · ${periodLabels[budget.periodType]}`;
    }

    const sameYear = start.getFullYear() === end.getFullYear();
    const startLabel = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(sameYear ? {} : { year: "numeric" }),
    });
    const endLabel = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return `${startLabel} – ${endLabel} · ${periodLabels[budget.periodType]}`;
}
