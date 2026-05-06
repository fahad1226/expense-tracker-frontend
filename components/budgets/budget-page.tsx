"use client";

import SetBudgetDialog from "@/components/budgets/set-budget-dialog";
import MonthPicker from "@/components/dashboard/monthly-filter";
import {
    currentYearMonth,
    fetchBudgetOverview,
    formatBudgetMonthLabel,
    saveMonthlyBudget,
    type BudgetOverview,
    type BudgetStatus,
} from "@/lib/budgets";
import { formatCurrency, formatDate } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
    AlertTriangleIcon,
    ChevronDownIcon,
    PiggyBankIcon,
    ReceiptIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_COPY: Record<
    BudgetStatus,
    { label: string; hint: string; chipClass: string }
> = {
    unset: {
        label: "No budget set",
        hint: "Add a monthly cap to track progress.",
        chipClass: "bg-gray-100 text-gray-700",
    },
    ok: {
        label: "Under budget",
        hint: "You are below 80% of your cap.",
        chipClass: "bg-emerald-50 text-emerald-800",
    },
    warning: {
        label: "Close to limit",
        hint: "You have used at least 80% of this month's cap.",
        chipClass: "bg-amber-50 text-amber-800",
    },
    over: {
        label: "Over budget",
        hint: "Spending has exceeded your cap.",
        chipClass: "bg-red-50 text-red-800",
    },
};

export default function BudgetPage() {
    const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
    const [overview, setOverview] = useState<BudgetOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchBudgetOverview(selectedMonth);
            setOverview(data);
        } catch {
            toast.error("Could not load budget.");
            setOverview(null);
        } finally {
            setLoading(false);
        }
    }, [selectedMonth]);

    useEffect(() => {
        void load();
    }, [load]);

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

    return (
        <div className="space-y-8">
            <SetBudgetDialog
                open={budgetDialogOpen}
                onClose={() => setBudgetDialogOpen(false)}
                monthLabel={monthLabel}
                initialAmount={overview?.budgetAmount ?? null}
                onSave={handleSaveBudget}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Budgets
                        </h1>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                            Beta
                        </span>
                    </div>
                    <p className="mt-0.5 max-w-xl text-sm text-gray-500">
                        See if this month is on track and which categories use
                        the most of your spending.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <Popover className="relative">
                    <PopoverButton className="flex min-w-[200px] items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                        <span>{monthLabel}</span>
                        <ChevronDownIcon className="size-4 text-gray-400" />
                    </PopoverButton>
                    <PopoverPanel
                        anchor="bottom start"
                        className="z-50 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
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

                <button
                    type="button"
                    onClick={() => setBudgetDialogOpen(true)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm ring-1 ring-violet-100 transition-colors hover:bg-violet-50"
                >
                    {overview?.hasBudget ? "Edit budget" : "Set monthly budget"}
                </button>
            </div>

            {loading && (
                <p className="text-sm text-gray-500">Loading budget…</p>
            )}

            {!loading && overview && (
                <>
                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                        <div className="border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <PiggyBankIcon className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        This month
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Spent vs your budget cap
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 p-6">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <MetricCard
                                    label="Budget cap"
                                    value={
                                        overview.hasBudget &&
                                        overview.budgetAmount != null
                                            ? formatCurrency(
                                                  overview.budgetAmount,
                                              )
                                            : "—"
                                    }
                                />
                                <MetricCard
                                    label="Spent so far"
                                    value={formatCurrency(overview.spent)}
                                    emphasized
                                />
                                <div className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Time left
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-gray-900">
                                        {overview.daysRemainingInMonth != null
                                            ? `${overview.daysRemainingInMonth} day${overview.daysRemainingInMonth === 1 ? "" : "s"} left`
                                            : "—"}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Shown only for the current calendar
                                        month.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                                    <span className="font-medium text-gray-700">
                                        Progress
                                    </span>
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                                            statusMeta.chipClass,
                                        )}
                                    >
                                        {overview.status === "over" && (
                                            <AlertTriangleIcon className="size-3.5" />
                                        )}
                                        {statusMeta.label}
                                    </span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            !overview.hasBudget &&
                                                "w-0 bg-transparent",
                                            overview.hasBudget &&
                                                overview.status === "ok" &&
                                                "bg-emerald-500",
                                            overview.hasBudget &&
                                                overview.status === "warning" &&
                                                "bg-amber-500",
                                            overview.hasBudget &&
                                                overview.status === "over" &&
                                                "bg-red-500",
                                        )}
                                        style={
                                            overview.hasBudget
                                                ? {
                                                      width: `${barOverflow ? 100 : progressPercent}%`,
                                                  }
                                                : undefined
                                        }
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-600">
                                    {!overview.hasBudget ? (
                                        statusMeta.hint
                                    ) : overview.percentUsed != null ? (
                                        <>
                                            {overview.percentUsed.toFixed(1)}%
                                            of budget
                                            {overview.remaining != null && (
                                                <>
                                                    {" "}
                                                    ·{" "}
                                                    {overview.remaining < 0 ? (
                                                        <span className="font-medium text-red-700">
                                                            Over by{" "}
                                                            {formatCurrency(
                                                                Math.abs(
                                                                    overview.remaining,
                                                                ),
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            {formatCurrency(
                                                                overview.remaining,
                                                            )}{" "}
                                                            left
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    ) : null}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                        <div className="border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                            <h2 className="text-base font-semibold text-gray-900">
                                Where the money went
                            </h2>
                            <p className="text-xs text-gray-500">
                                By category · sorted by amount (highest first)
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {overview.categoryBreakdown.length === 0 ? (
                                <p className="px-6 py-10 text-center text-sm text-gray-500">
                                    No expenses this month.
                                </p>
                            ) : (
                                <table className="min-w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            <th className="px-6 py-3">
                                                Category
                                            </th>
                                            <th className="px-6 py-3">Spent</th>
                                            <th className="px-6 py-3">
                                                Share of spend
                                            </th>
                                            <th className="hidden px-6 py-3 sm:table-cell">
                                                Visual
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {overview.categoryBreakdown.map(
                                            (c, _, arr) => {
                                                const max = arr[0]?.amount ?? 1;
                                                const barPct =
                                                    max > 0
                                                        ? Math.round(
                                                              (c.amount / max) *
                                                                  100,
                                                          )
                                                        : 0;
                                                return (
                                                    <tr
                                                        key={c.categoryId}
                                                        className="hover:bg-gray-50/80"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-gray-900">
                                                            {c.name}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-800">
                                                            {formatCurrency(
                                                                c.amount,
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600">
                                                            {c.sharePercent.toFixed(
                                                                1,
                                                            )}
                                                            %
                                                        </td>
                                                        <td className="hidden px-6 py-4 sm:table-cell">
                                                            <div className="h-2 max-w-[140px] overflow-hidden rounded-full bg-gray-100">
                                                                <div
                                                                    className="h-full rounded-full bg-violet-400"
                                                                    style={{
                                                                        width: `${barPct}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                        <div className="border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <ReceiptIcon className="size-5 text-violet-600" />
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Largest expenses this month
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Top five by amount
                                    </p>
                                </div>
                            </div>
                        </div>
                        {overview.topExpenses.length === 0 ? (
                            <p className="px-6 py-10 text-center text-sm text-gray-500">
                                No expenses to show.
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-50 px-4">
                                {overview.topExpenses.map((e) => (
                                    <li
                                        key={e.id}
                                        className="flex items-center justify-between gap-3 py-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-900">
                                                {e.description || "—"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {e.categoryName || "—"} ·{" "}
                                                {formatDate(e.date)}
                                            </p>
                                        </div>
                                        <p className="shrink-0 font-semibold text-gray-900">
                                            {formatCurrency(e.amount)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <div className="flex justify-center">
                        <Link
                            href="/expenses/list"
                            className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                        >
                            View all expenses →
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

function MetricCard({
    label,
    value,
    emphasized,
}: {
    label: string;
    value: string;
    emphasized?: boolean;
}) {
    return (
        <div
            className={cn(
                "rounded-xl border px-4 py-3",
                emphasized
                    ? "border-violet-200 bg-violet-50/40"
                    : "border-gray-100 bg-gray-50/50",
            )}
        >
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {label}
            </p>
            <p
                className={cn(
                    "mt-2 text-xl font-bold tracking-tight text-gray-900",
                    emphasized && "text-violet-900",
                )}
            >
                {value}
            </p>
        </div>
    );
}
