"use client";

import {
    Expense,
    expenseCategories,
    formatCurrency,
    formatDate,
    getCategoryLabel,
    mockExpenses,
} from "@/lib/expenses";
import { cn } from "@/lib/utils";
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
import { useState } from "react";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const CHART_COLORS = [
    "#6366f1", // indigo-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ec4899", // pink-500
    "#14b8a6", // teal-500
    "#f97316", // orange-500
    "#64748b", // slate-500
];

function getMonthExpenses(expenses: Expense[], year: number, month: number) {
    return expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });
}

function getCurrentMonthExpenses(expenses: Expense[]) {
    const now = new Date();
    return getMonthExpenses(expenses, now.getFullYear(), now.getMonth());
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

function getWeeklyBreakdown(expenses: Expense[]) {
    const weeks: Record<string, Record<string, number>> = {};
    for (const e of expenses) {
        const d = new Date(e.date);
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const key = weekStart.toISOString().slice(0, 10);
        if (!weeks[key]) weeks[key] = {};
        weeks[key][e.category] = (weeks[key][e.category] ?? 0) + e.amount;
    }
    return Object.entries(weeks)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, cats]) => ({
            week: new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            ...Object.fromEntries(
                Object.entries(cats).map(([c, v]) => [
                    getCategoryLabel(
                        c as (typeof expenseCategories)[number]["value"],
                    ),
                    v,
                ]),
            ),
        }));
}

export default function Dashboard() {
    const now = new Date();
    const monthExpenses = getCurrentMonthExpenses(mockExpenses);
    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const prevYear =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const prevMonthExpenses = getMonthExpenses(
        mockExpenses,
        prevYear,
        prevMonth,
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

    const pieData = categoryTotals;
    const barData = getWeeklyBreakdown(monthExpenses);
    const barCategories = [...new Set(categoryTotals.map((c) => c.name))];

    const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">(
        "weekly",
    );
    const monthLabel = now.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="space-y-8">
            {/* Header with date range & actions */}
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
                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm">
                        <span>{monthLabel}</span>
                        <ChevronDownIcon className="size-4 text-gray-400" />
                    </div>
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
                    value={formatCurrency(totalThisMonth)}
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
                    value={mostExpensive ? mostExpensive.name : "—"}
                    subValue={
                        mostExpensive
                            ? formatCurrency(mostExpensive.value)
                            : undefined
                    }
                    icon={TrendingUpIcon}
                />
                <SummaryCard
                    title="Transactions"
                    value={String(transactionCount)}
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
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Spending overview - Stacked bar */}
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                    <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Spending overview
                            </h2>
                            <p className="mt-0.5 text-sm text-gray-500">
                                {formatCurrency(totalThisMonth)} total
                                {totalTrend !== null && (
                                    <span
                                        className={cn(
                                            "ml-2 font-medium",
                                            totalTrend >= 0
                                                ? "text-emerald-600"
                                                : "text-red-600",
                                        )}
                                    >
                                        {totalTrend >= 0 ? (
                                            <ArrowUpIcon className="inline size-3.5" />
                                        ) : (
                                            <ArrowDownIcon className="inline size-3.5" />
                                        )}{" "}
                                        {Math.abs(totalTrend).toFixed(1)}%
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setChartPeriod("weekly")}
                                className={cn(
                                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                                    chartPeriod === "weekly"
                                        ? "bg-violet-100 text-violet-700"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                                )}
                            >
                                Weekly
                            </button>
                            <button
                                type="button"
                                onClick={() => setChartPeriod("monthly")}
                                className={cn(
                                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                                    chartPeriod === "monthly"
                                        ? "bg-violet-100 text-violet-700"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                                )}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        {barData.length > 0 ? (
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={barData}
                                        margin={{
                                            top: 16,
                                            right: 16,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <XAxis
                                            dataKey="week"
                                            tick={{
                                                fontSize: 11,
                                                fill: "#6b7280",
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize: 11,
                                                fill: "#6b7280",
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(v) =>
                                                v >= 1000
                                                    ? `$${v / 1000}k`
                                                    : `$${v}`
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value: number) =>
                                                formatCurrency(value)
                                            }
                                            contentStyle={{
                                                borderRadius: "10px",
                                                border: "1px solid #e5e7eb",
                                                boxShadow:
                                                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                                padding: "12px 16px",
                                            }}
                                            labelStyle={{
                                                fontWeight: 600,
                                                color: "#111827",
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: 16 }}
                                            formatter={(value) => (
                                                <span className="text-xs font-medium text-gray-600">
                                                    {value}
                                                </span>
                                            )}
                                        />
                                        {barCategories
                                            .slice(0, 5)
                                            .map((cat, i) => (
                                                <Bar
                                                    key={cat}
                                                    dataKey={cat}
                                                    stackId="a"
                                                    fill={
                                                        CHART_COLORS[
                                                            i %
                                                                CHART_COLORS.length
                                                        ]
                                                    }
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                                No spending data this month
                            </div>
                        )}
                    </div>
                </div>

                {/* Category distribution - Donut */}
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-6 py-4">
                        <h2 className="text-base font-semibold text-gray-900">
                            Spending distribution
                        </h2>
                        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600">
                            Monthly
                            <ChevronDownIcon className="size-3.5" />
                        </div>
                    </div>
                    <div className="p-6">
                        {pieData.length > 0 ? (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="h-56 w-full sm:h-64 sm:w-1/2">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={52}
                                                outerRadius={80}
                                                paddingAngle={3}
                                                dataKey="value"
                                                nameKey="name"
                                            >
                                                {pieData.map((_, i) => (
                                                    <Cell
                                                        key={i}
                                                        fill={
                                                            CHART_COLORS[
                                                                i %
                                                                    CHART_COLORS.length
                                                            ]
                                                        }
                                                        stroke="none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number) =>
                                                    formatCurrency(value)
                                                }
                                                contentStyle={{
                                                    borderRadius: "10px",
                                                    border: "1px solid #e5e7eb",
                                                    boxShadow:
                                                        "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                                    padding: "12px 16px",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-1 flex-col gap-2 sm:gap-3">
                                    {pieData.slice(0, 5).map((item, i) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between gap-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="size-2.5 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            CHART_COLORS[
                                                                i %
                                                                    CHART_COLORS.length
                                                            ],
                                                    }}
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(item.value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-sm text-gray-500">
                                No expenses this month
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                            {monthExpenses
                                .sort(
                                    (a, b) =>
                                        new Date(b.date).getTime() -
                                        new Date(a.date).getTime(),
                                )
                                .slice(0, 8)
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
                {monthExpenses.length === 0 && (
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
