"use client";

import AddBudgetDialog from "@/components/budgets/add-budget-dialog";
import BudgetCard from "@/components/budgets/budget-card";
import SetBudgetDialog from "@/components/budgets/set-budget-dialog";
import MonthPicker from "@/components/dashboard/monthly-filter";
import { apiClient } from "@/config/api.client";
import {
    createCategoryBudget,
    currentYearMonth,
    deleteCategoryBudget,
    fetchBudgetOverview,
    fetchCategoryBudgets,
    formatBudgetMonthLabel,
    saveMonthlyBudget,
    updateCategoryBudget,
    type BudgetLifecycleStatus,
    type BudgetOverview,
    type BudgetStatus,
    type CategoryBudget,
    type CreateCategoryBudgetInput,
} from "@/lib/budgets";
import { formatCurrency, formatDate } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
    AlertTriangleIcon,
    ArrowUpRightIcon,
    CalendarIcon,
    ChevronDownIcon,
    LayersIcon,
    PiggyBankIcon,
    PlusIcon,
    ReceiptIcon,
    TrendingUpIcon,
    WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type CategoryOption = {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
};

type LifecycleFilter = "all" | BudgetLifecycleStatus;

const STATUS_COPY: Record<
    BudgetStatus,
    { label: string; hint: string; chipClass: string; accent: string }
> = {
    unset: {
        label: "No cap set",
        hint: "Set your monthly budget to start tracking.",
        chipClass: "bg-gray-100 text-gray-600 ring-gray-200",
        accent: "from-gray-400 to-gray-500",
    },
    ok: {
        label: "On track",
        hint: "Spending is within a healthy range.",
        chipClass: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
        accent: "from-emerald-400 to-emerald-600",
    },
    warning: {
        label: "Near limit",
        hint: "You have used at least 80% of your monthly cap.",
        chipClass: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
        accent: "from-amber-400 to-amber-600",
    },
    over: {
        label: "Over budget",
        hint: "Spending has exceeded your monthly cap.",
        chipClass: "bg-red-500/10 text-red-700 ring-red-500/20",
        accent: "from-red-400 to-red-600",
    },
};

const LIFECYCLE_FILTERS: { value: LifecycleFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "upcoming", label: "Upcoming" },
    { value: "expired", label: "Expired" },
];

export default function BudgetPage() {
    const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
    const [overview, setOverview] = useState<BudgetOverview | null>(null);
    const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(
        [],
    );
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
    const [addBudgetDialogOpen, setAddBudgetDialogOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<CategoryBudget | null>(
        null,
    );
    const [lifecycleFilter, setLifecycleFilter] =
        useState<LifecycleFilter>("all");

    const loadCategories = useCallback(async () => {
        const { data } = await apiClient().get<{
            categories: CategoryOption[];
        }>("/categories");
        setCategories(data.categories ?? []);
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [overviewData, categoryBudgetData] = await Promise.all([
                fetchBudgetOverview(selectedMonth),
                fetchCategoryBudgets(),
            ]);
            setOverview(overviewData);
            setCategoryBudgets(categoryBudgetData);
        } catch {
            toast.error("Could not load budget.");
            setOverview(null);
            setCategoryBudgets([]);
        } finally {
            setLoading(false);
        }
    }, [selectedMonth]);

    useEffect(() => {
        void load();
    }, [load]);

    useEffect(() => {
        void loadCategories();
    }, [loadCategories]);

    const filteredCategoryBudgets = useMemo(() => {
        if (lifecycleFilter === "all") {
            return categoryBudgets;
        }
        return categoryBudgets.filter(
            (budget) => budget.lifecycleStatus === lifecycleFilter,
        );
    }, [categoryBudgets, lifecycleFilter]);

    const monthLabel = formatBudgetMonthLabel(selectedMonth);
    const statusMeta = overview
        ? STATUS_COPY[overview.status]
        : STATUS_COPY.unset;

    const progressPercent =
        overview?.hasBudget &&
        overview.budgetAmount != null &&
        overview.budgetAmount > 0 &&
        overview.percentUsed != null
            ? Math.min(100, overview.percentUsed)
            : 0;

    const barOverflow =
        overview?.hasBudget &&
        overview.percentUsed != null &&
        overview.percentUsed > 100;

    const handleSaveBudget = async (amount: number) => {
        const updated = await saveMonthlyBudget(selectedMonth, amount);
        setOverview(updated);
        toast.success("Budget saved");
    };

    const handleCreateOrUpdateBudget = async (
        input: CreateCategoryBudgetInput,
    ) => {
        if (editingBudget) {
            const updated = await updateCategoryBudget(editingBudget.id, input);
            setCategoryBudgets((prev) =>
                prev.map((budget) =>
                    budget.id === updated.id ? updated : budget,
                ),
            );
            const refreshedOverview = await fetchBudgetOverview(selectedMonth);
            setOverview(refreshedOverview);
            toast.success("Budget updated");
            return;
        }

        const created = await createCategoryBudget(input);
        setCategoryBudgets((prev) => [created, ...prev]);
        const refreshedOverview = await fetchBudgetOverview(selectedMonth);
        setOverview(refreshedOverview);
        toast.success("Budget created");
    };

    const handleDeleteBudget = async (budget: CategoryBudget) => {
        const confirmed = window.confirm(
            `Delete the ${budget.category.name} budget?`,
        );
        if (!confirmed) {
            return;
        }

        try {
            await deleteCategoryBudget(budget.id);
            setCategoryBudgets((prev) =>
                prev.filter((item) => item.id !== budget.id),
            );
            const refreshedOverview = await fetchBudgetOverview(selectedMonth);
            setOverview(refreshedOverview);
            toast.success("Budget deleted");
        } catch {
            toast.error("Could not delete budget.");
        }
    };

    const openCreateBudgetDialog = () => {
        setEditingBudget(null);
        setAddBudgetDialogOpen(true);
    };

    const openEditBudgetDialog = (budget: CategoryBudget) => {
        setEditingBudget(budget);
        setAddBudgetDialogOpen(true);
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8 pb-10">
            <SetBudgetDialog
                open={budgetDialogOpen}
                onClose={() => setBudgetDialogOpen(false)}
                monthLabel={monthLabel}
                initialAmount={overview?.budgetAmount ?? null}
                onSave={handleSaveBudget}
            />

            <AddBudgetDialog
                open={addBudgetDialogOpen}
                onClose={() => {
                    setAddBudgetDialogOpen(false);
                    setEditingBudget(null);
                }}
                categories={categories}
                onCategoriesChanged={() => {
                    void loadCategories();
                }}
                onSave={handleCreateOrUpdateBudget}
                editingBudget={editingBudget}
                defaultReferenceMonth={selectedMonth}
            />

            {/* Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Budgets
                        </h1>
                        <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-violet-700 ring-1 ring-violet-500/20">
                            Beta
                        </span>
                    </div>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
                        Plan your month, allocate by category, and watch
                        spending update automatically.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Popover className="relative">
                        <PopoverButton className="flex min-w-48 items-center justify-between gap-2 rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-all hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/30">
                            <span className="inline-flex items-center gap-2">
                                <CalendarIcon className="size-4 text-violet-500" />
                                {monthLabel}
                            </span>
                            <ChevronDownIcon className="size-4 text-gray-400" />
                        </PopoverButton>
                        <PopoverPanel
                            anchor="bottom end"
                            className="z-50 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-200/50"
                        >
                            {({ close }) => (
                                <MonthPicker
                                    key={selectedMonth}
                                    selectedMonth={selectedMonth}
                                    onSelect={(ym) => {
                                        setSelectedMonth(ym);
                                        close();
                                    }}
                                />
                            )}
                        </PopoverPanel>
                    </Popover>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setBudgetDialogOpen(true)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-700"
                        >
                            {overview?.hasBudget ? "Edit cap" : "Set cap"}
                        </button>
                        <button
                            type="button"
                            onClick={openCreateBudgetDialog}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-violet-500/30"
                        >
                            <PlusIcon className="size-4" />
                            Add budget
                        </button>
                    </div>
                </div>
            </div>

            {loading && <BudgetPageSkeleton />}

            {!loading && overview && (
                <>
                    {/* Monthly hero */}
                    <section className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-sm">
                        <div
                            className={cn(
                                "bg-gradient-to-br px-6 py-8 sm:px-8",
                                overview.hasBudget
                                    ? "from-violet-50/80 via-white to-indigo-50/50"
                                    : "from-gray-50 via-white to-gray-50/50",
                            )}
                        >
                            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200/80 backdrop-blur-sm">
                                            <PiggyBankIcon className="size-3.5 text-violet-500" />
                                            {monthLabel}
                                        </span>
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                                                statusMeta.chipClass,
                                            )}
                                        >
                                            {overview.status === "over" && (
                                                <AlertTriangleIcon className="size-3.5" />
                                            )}
                                            {statusMeta.label}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Spent this month
                                        </p>
                                        <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                            {formatCurrency(overview.spent)}
                                        </p>
                                        {overview.hasBudget &&
                                            overview.budgetAmount != null && (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    of{" "}
                                                    <span className="font-semibold text-gray-700">
                                                        {formatCurrency(
                                                            overview.budgetAmount,
                                                        )}
                                                    </span>{" "}
                                                    monthly cap
                                                    {overview.remaining !=
                                                        null && (
                                                        <>
                                                            {" · "}
                                                            <span
                                                                className={cn(
                                                                    "font-semibold",
                                                                    overview.remaining <
                                                                        0
                                                                        ? "text-red-600"
                                                                        : "text-emerald-600",
                                                                )}
                                                            >
                                                                {overview.remaining <
                                                                0
                                                                    ? `${formatCurrency(Math.abs(overview.remaining))} over`
                                                                    : `${formatCurrency(overview.remaining)} left`}
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                            )}
                                    </div>
                                </div>

                                {overview.hasBudget && (
                                    <div className="flex shrink-0 flex-col items-center gap-2">
                                        <div className="relative size-32">
                                            <svg
                                                className="-rotate-90 size-32"
                                                viewBox="0 0 128 128"
                                            >
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="54"
                                                    fill="none"
                                                    strokeWidth="8"
                                                    className="stroke-gray-100"
                                                />
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="54"
                                                    fill="none"
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    strokeDasharray={
                                                        2 * Math.PI * 54
                                                    }
                                                    strokeDashoffset={
                                                        2 *
                                                        Math.PI *
                                                        54 *
                                                        (1 -
                                                            progressPercent /
                                                                100)
                                                    }
                                                    className={cn(
                                                        "transition-all duration-700",
                                                        overview.status ===
                                                            "ok" &&
                                                            "stroke-emerald-500",
                                                        overview.status ===
                                                            "warning" &&
                                                            "stroke-amber-500",
                                                        overview.status ===
                                                            "over" &&
                                                            "stroke-red-500",
                                                    )}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    {overview.percentUsed?.toFixed(
                                                        0,
                                                    ) ?? 0}
                                                    %
                                                </span>
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                                    used
                                                </span>
                                            </div>
                                        </div>
                                        {overview.daysRemainingInMonth !=
                                            null && (
                                            <p className="text-xs text-gray-500">
                                                {overview.daysRemainingInMonth}{" "}
                                                days remaining
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-px border-t border-gray-100 bg-gray-100 sm:grid-cols-3">
                            <SummaryStat
                                icon={WalletIcon}
                                label="Total cap"
                                value={
                                    overview.hasBudget &&
                                    overview.budgetAmount != null
                                        ? formatCurrency(overview.budgetAmount)
                                        : "Not set"
                                }
                            />
                            <SummaryStat
                                icon={TrendingUpIcon}
                                label="Spent"
                                value={formatCurrency(overview.spent)}
                                highlight
                            />
                            <SummaryStat
                                icon={PiggyBankIcon}
                                label="Remaining"
                                value={
                                    overview.remaining != null
                                        ? formatCurrency(overview.remaining)
                                        : "—"
                                }
                                danger={
                                    overview.remaining != null &&
                                    overview.remaining < 0
                                }
                            />
                        </div>

                        {overview.hasBudget && (
                            <div className="px-6 py-5 sm:px-8">
                                <ProgressTrack
                                    label="Spending progress"
                                    percent={
                                        barOverflow ? 100 : progressPercent
                                    }
                                    gradient={statusMeta.accent}
                                    caption={
                                        overview.percentUsed != null
                                            ? `${overview.percentUsed.toFixed(1)}% of monthly cap used`
                                            : statusMeta.hint
                                    }
                                />
                            </div>
                        )}

                        {!overview.hasBudget && (
                            <div className="border-t border-gray-100 px-6 py-5 sm:px-8">
                                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-violet-900/80">
                                        {statusMeta.hint}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setBudgetDialogOpen(true)
                                        }
                                        className="shrink-0 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                                    >
                                        Set monthly cap
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Category budgets */}
                    <section className="space-y-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                                        Category budgets
                                    </h2>
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                        {filteredCategoryBudgets.length}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Independent caps that track expenses
                                    automatically.
                                </p>
                            </div>

                            <div className="inline-flex rounded-xl bg-gray-100/80 p-1">
                                {LIFECYCLE_FILTERS.map((filter) => (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        onClick={() =>
                                            setLifecycleFilter(filter.value)
                                        }
                                        className={cn(
                                            "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
                                            lifecycleFilter === filter.value
                                                ? "bg-white text-violet-700 shadow-sm"
                                                : "text-gray-500 hover:text-gray-700",
                                        )}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredCategoryBudgets.length === 0 ? (
                            <EmptyCategoryBudgets
                                onAdd={openCreateBudgetDialog}
                                filtered={lifecycleFilter !== "all"}
                            />
                        ) : (
                            <div className="grid gap-4 lg:grid-cols-2">
                                {filteredCategoryBudgets.map((budget) => (
                                    <BudgetCard
                                        key={budget.id}
                                        budget={budget}
                                        onEdit={openEditBudgetDialog}
                                        onDelete={handleDeleteBudget}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Insights */}
                    <section className="grid gap-5 lg:grid-cols-5">
                        <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm lg:col-span-3">
                            <SectionHeader
                                title="Spending by category"
                                subtitle="Where your money went this month"
                            />
                            {overview.categoryBreakdown.length === 0 ? (
                                <EmptyInline message="No expenses recorded this month." />
                            ) : (
                                <ul className="divide-y divide-gray-50 px-2 pb-2">
                                    {overview.categoryBreakdown.map(
                                        (c, _, arr) => {
                                            const max = arr[0]?.amount ?? 1;
                                            const barPct =
                                                max > 0
                                                    ? (c.amount / max) * 100
                                                    : 0;
                                            return (
                                                <li
                                                    key={c.categoryId}
                                                    className="flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-gray-50/80"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <p className="truncate font-medium text-gray-900">
                                                                {c.name}
                                                            </p>
                                                            <p className="shrink-0 text-sm font-semibold text-gray-900">
                                                                {formatCurrency(
                                                                    c.amount,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-3">
                                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                                <div
                                                                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-500 transition-all"
                                                                    style={{
                                                                        width: `${barPct}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="shrink-0 text-xs font-medium text-gray-500">
                                                                {c.sharePercent.toFixed(
                                                                    0,
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        },
                                    )}
                                </ul>
                            )}
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm lg:col-span-2">
                            <SectionHeader
                                icon={ReceiptIcon}
                                title="Top expenses"
                                subtitle="Largest this month"
                            />
                            {overview.topExpenses.length === 0 ? (
                                <EmptyInline message="No expenses to show yet." />
                            ) : (
                                <ul className="divide-y divide-gray-50 px-2 pb-2">
                                    {overview.topExpenses.map((e, index) => (
                                        <li
                                            key={e.id}
                                            className="flex items-start gap-3 rounded-xl px-4 py-3.5 transition-colors hover:bg-gray-50/80"
                                        >
                                            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[11px] font-bold text-gray-500">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-gray-900">
                                                    {e.description || "—"}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    {e.categoryName || "—"} ·{" "}
                                                    {formatDate(e.date)}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-sm font-bold text-gray-900">
                                                {formatCurrency(e.amount)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    <div className="flex justify-center pt-2">
                        <Link
                            href="/expenses/list"
                            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200/80"
                        >
                            View all expenses
                            <ArrowUpRightIcon className="size-4" />
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

function SectionHeader({
    title,
    subtitle,
    icon: Icon,
}: {
    title: string;
    subtitle: string;
    icon?: React.ComponentType<{ className?: string }>;
}) {
    return (
        <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2.5">
                {Icon && (
                    <div className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <Icon className="size-4" />
                    </div>
                )}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                        {title}
                    </h3>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

function SummaryStat({
    icon: Icon,
    label,
    value,
    highlight,
    danger,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    highlight?: boolean;
    danger?: boolean;
}) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 bg-white px-5 py-4",
                highlight && "bg-violet-50/30",
            )}
        >
            <div
                className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl",
                    highlight
                        ? "bg-violet-100 text-violet-600"
                        : "bg-gray-100 text-gray-500",
                )}
            >
                <Icon className="size-4" />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {label}
                </p>
                <p
                    className={cn(
                        "mt-0.5 truncate text-sm font-bold text-gray-900",
                        highlight && "text-violet-900",
                        danger && "text-red-600",
                    )}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

function ProgressTrack({
    label,
    percent,
    gradient,
    caption,
}: {
    label: string;
    percent: number;
    gradient: string;
    caption: string;
}) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {label}
                </span>
                <span className="text-xs font-medium text-gray-600">
                    {caption}
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                    className={cn(
                        "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                        gradient,
                    )}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

function EmptyCategoryBudgets({
    onAdd,
    filtered,
}: {
    onAdd: () => void;
    filtered: boolean;
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/50 to-white px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                <LayersIcon className="size-6" />
            </div>
            <p className="mt-4 text-base font-semibold text-gray-900">
                {filtered
                    ? "No budgets match this filter"
                    : "No category budgets yet"}
            </p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {filtered
                    ? "Try a different filter or create a new budget."
                    : "Split your monthly cap into focused budgets like Travel, Groceries, or Savings."}
            </p>
            {!filtered && (
                <button
                    type="button"
                    onClick={onAdd}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 hover:bg-violet-700"
                >
                    <PlusIcon className="size-4" />
                    Create first budget
                </button>
            )}
        </div>
    );
}

function EmptyInline({ message }: { message: string }) {
    return (
        <p className="px-6 py-12 text-center text-sm text-gray-500">
            {message}
        </p>
    );
}

function BudgetPageSkeleton() {
    return (
        <div className="animate-pulse space-y-8">
            <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50" />
                <div className="grid gap-px bg-gray-100 sm:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-20 bg-white" />
                    ))}
                </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-56 rounded-2xl border border-gray-200/70 bg-white"
                    />
                ))}
            </div>
        </div>
    );
}
