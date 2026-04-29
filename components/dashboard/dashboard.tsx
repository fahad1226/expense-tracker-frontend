"use client";

import { apiClient } from "@/config/api.client";
import {
    Expense,
    expenseCategories,
    formatCurrency,
    formatDate,
    getCategoryLabel,
    toISODate,
} from "@/lib/expenses";
import { cn, show_data } from "@/lib/utils";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowUpRightIcon,
    ChevronDownIcon,
    DownloadIcon,
    FilterIcon,
    ReceiptIcon,
    TrendingUpIcon,
    WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import ApplicationCharts from "./charts";
import MonthPicker from "./monthly-filter";

const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

/** Format YYYY-MM to display label e.g. "March 2025" */
function formatMonthLabel(yearMonth: string): string {
    const [y, m] = yearMonth.split("-").map(Number);
    return new Date(y!, m! - 1, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

/** Get current month as YYYY-MM */
function getCurrentYearMonth(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
}

function generateMockExpenses(
    expenseEntries: Omit<Expense, "date">[],
): Expense[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    const entries: Omit<Expense, "date">[] = expenseEntries;

    // Current month: spread across 4 weeks (days 1, 5, 8, 12, 15, 18, 22, 25)
    const currentMonthDates = [1, 5, 8, 12, 15, 18, 22, 25];
    const currentMonthExpenses = entries.slice(0, 29).map((e, i) => ({
        ...e,
        date: toISODate(
            new Date(
                year,
                month,
                Math.min(currentMonthDates[Math.floor(i / 4)] ?? 1, 28),
            ),
        ),
    }));

    // Previous month: 3 expenses for trend comparison
    const prevMonthExpenses: Expense[] = [
        {
            ...entries[0]!,
            id: "30",
            date: toISODate(new Date(prevYear, prevMonth, 15)),
        },
        {
            ...entries[2]!,
            id: "31",
            date: toISODate(new Date(prevYear, prevMonth, 10)),
        },
        {
            ...entries[1]!,
            id: "32",
            date: toISODate(new Date(prevYear, prevMonth, 8)),
        },
    ].map(({ id, amount, category, description, date }) => ({
        id,
        amount,
        category,
        description,
        date,
    }));

    return [...currentMonthExpenses, ...prevMonthExpenses];
}

/** Parse YYYY-MM-DD as local date (avoids UTC timezone shift) */
function parseLocalDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y!, m! - 1, d!);
}

function getMonthExpenses(expenses: Expense[], year: number, month: number) {
    return expenses.filter((e) => {
        const d = parseLocalDate(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });
}

function getCategoryTotals(expenses: Expense[]) {
    const totals: Record<string, number> = {};
    for (const e of expenses) {
        totals[e.category] = (totals[e.category] ?? 0) + e.amount;
    }
    return Object.entries(totals).map(([category, amount]) => ({
        name: getCategoryLabel(
            category as (typeof expenseCategories)[number]["value"],
        ),
        value: amount,
        category,
    }));
}

interface DashboardProps {
    totalExpenses: number;
    totalExpensesThisMonth: number;
    mostExpensiveCategory: {
        totalSpent: number;
        name: string;
    };
    totalCategories: number;
    expenses: Expense[];
}

export default function Dashboard({ data }: { data: DashboardProps }) {
    const now = new Date();
    const currentYearMonth = getCurrentYearMonth();

    const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
    const [dashboardData, setDashboardData] = useState<DashboardProps>(data);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDashboardForMonth = useCallback(async (yearMonth: string) => {
        setIsLoading(true);
        try {
            const { data: res } = await apiClient().get<DashboardProps>(
                "/dashboard",
                { params: { month: yearMonth } },
            );
            console.log("res", res);
            setDashboardData(res);
        } catch {
            // Keep existing data on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleMonthSelect = useCallback(
        (yearMonth: string) => {
            console.log("yearMonth", yearMonth);
            setSelectedMonth(yearMonth);
            if (yearMonth !== currentYearMonth) {
                fetchDashboardForMonth(yearMonth);
            } else {
                setDashboardData(data);
            }
        },
        [currentYearMonth, data, fetchDashboardForMonth],
    );

    const mockExpenses: Expense[] = generateMockExpenses(
        dashboardData.expenses,
    );

    const [selYear, selMonth] = selectedMonth.split("-").map(Number);
    const selMonth0 = (selMonth ?? 1) - 1;
    const monthExpenses = getMonthExpenses(
        mockExpenses,
        selYear ?? now.getFullYear(),
        selMonth0,
    );
    const prevMonth0 = selMonth0 === 0 ? 11 : selMonth0 - 1;
    const prevYear =
        selMonth0 === 0 ? (selYear ?? now.getFullYear()) - 1 : (selYear ?? 0);
    const prevMonthExpenses = getMonthExpenses(
        mockExpenses,
        prevYear,
        prevMonth0,
    );

    const totalThisMonth = monthExpenses.reduce((s, e) => s + e.amount, 0);
    const totalPrevMonth = prevMonthExpenses.reduce((s, e) => s + e.amount, 0);
    const totalTrend =
        totalPrevMonth > 0
            ? ((totalThisMonth - totalPrevMonth) / totalPrevMonth) * 100
            : null;

    const categoryTotals = getCategoryTotals(monthExpenses);
    const mostExpensive =
        categoryTotals.length > 0
            ? categoryTotals.reduce((a, b) => (a.value > b.value ? a : b))
            : null;
    const transactionCount = monthExpenses.length;
    const prevTransactionCount = prevMonthExpenses.length;
    const txTrend =
        prevTransactionCount > 0
            ? ((transactionCount - prevTransactionCount) /
                  prevTransactionCount) *
              100
            : null;

    const avgDailySpend =
        monthExpenses.length > 0
            ? totalThisMonth /
              Math.max(1, new Set(monthExpenses.map((e) => e.date)).size)
            : 0;

    const monthLabel = formatMonthLabel(selectedMonth);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Dashboard
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Overview of your spending
                    </p>
                </div>

             

                <div className="flex flex-wrap items-center gap-2">
                    <Popover className="relative">
                        <PopoverButton
                            disabled={isLoading}
                            className="flex min-w-[140px] items-center justify-between gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-70"
                        >
                            <span>{monthLabel}</span>
                            <ChevronDownIcon className="size-4 shrink-0 text-gray-400" />
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
                                        handleMonthSelect(ym);
                                        close();
                                    }}
                                />
                            )}
                        </PopoverPanel>
                    </Popover>
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
                    >
                        <FilterIcon className="size-4" />
                        Filter
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
                    >
                        <DownloadIcon className="size-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <SummaryCard
                    title="Total cost this month"
                    value={formatCurrency(dashboardData.totalExpensesThisMonth)}
                    icon={WalletIcon}
                    trend={
                        totalTrend !== null
                            ? {
                                  value: totalTrend,
                                  direction: totalTrend >= 0 ? "up" : "down",
                              }
                            : null
                    }
                    invertTrendColors
                />
                <SummaryCard
                    title="Most expensive category"
                    value={dashboardData.mostExpensiveCategory?.name ?? "n/a"}
                    subValue={
                        mostExpensive
                            ? formatCurrency(
                                  dashboardData.mostExpensiveCategory
                                      .totalSpent,
                              )
                            : undefined
                    }
                    icon={TrendingUpIcon}
                />
                <SummaryCard
                    title="Transactions"
                    value={formatCurrency(dashboardData.totalExpenses)}
                    subValue={
                        transactionCount > 0
                            ? `~${formatCurrency(avgDailySpend)}/day avg`
                            : undefined
                    }
                    icon={ReceiptIcon}
                    trend={
                        txTrend !== null
                            ? {
                                  value: txTrend,
                                  direction: txTrend >= 0 ? "up" : "down",
                              }
                            : null
                    }
                />
            </div>

            {/* Charts */}
            <ApplicationCharts
                expenses={dashboardData.expenses}
                selectedMonth={selectedMonth}
            />

            {/* Expense list */}
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-900">
                        Recent expenses
                    </h2>
                    <Link
                        href="/expenses/list"
                        className="flex items-center gap-1 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
                    >
                        See all
                        <ArrowUpRightIcon className="size-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="w-10 px-6 py-3.5">
                                    <input
                                        type="checkbox"
                                        className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                        aria-label="Select all"
                                    />
                                </th>
                                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                    Description
                                </th>
                                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                    Category
                                </th>
                                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                    Date
                                </th>
                                <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {dashboardData.expenses
                                .sort(
                                    (a, b) =>
                                        new Date(b.date).getTime() -
                                        new Date(a.date).getTime(),
                                )

                                .map((expense) => (
                                    <tr
                                        key={expense.id}
                                        className="group transition-colors hover:bg-gray-50/80"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                                aria-label={`Select ${expense.description}`}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-violet-50 group-hover:text-violet-600">
                                                    <ReceiptIcon className="size-4" />
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {expense.description || "—"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                {getCategoryLabel(
                                                    expense.category,
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(expense.date)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            {formatCurrency(expense.amount)}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {dashboardData.expenses.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100">
                            <ReceiptIcon className="size-7 text-gray-400" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-gray-500">
                            No expenses this month
                        </p>
                        <Link
                            href="/expenses/new"
                            className="mt-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                        >
                            Add your first expense
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function SummaryCard({
    title,
    value,
    subValue,
    icon: Icon,
    trend,
    invertTrendColors,
}: {
    title: string;
    value: string;
    subValue?: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: { value: number; direction: "up" | "down" } | null;
    invertTrendColors?: boolean;
}) {
    const trendColor =
        trend && invertTrendColors
            ? trend.direction === "up"
                ? "text-red-600"
                : "text-emerald-600"
            : trend
              ? trend.direction === "up"
                  ? "text-emerald-600"
                  : "text-red-600"
              : "";

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm shadow-gray-200/50 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                        {value}
                    </p>
                    {subValue && (
                        <p className="mt-0.5 text-sm text-gray-500">
                            {subValue}
                        </p>
                    )}
                    {trend && (
                        <p
                            className={cn(
                                "mt-2 inline-flex items-center gap-1 text-sm font-semibold",
                                trendColor,
                            )}
                        >
                            {trend.direction === "up" ? (
                                <ArrowUpIcon className="size-4" />
                            ) : (
                                <ArrowDownIcon className="size-4" />
                            )}
                            {Math.abs(trend.value).toFixed(1)}% vs last month
                        </p>
                    )}
                </div>
                <div className="ml-4 flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    );
}
