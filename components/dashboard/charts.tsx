import {
    Expense,
    expenseCategories,
    formatCurrency,
    getCategoryLabel,
} from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon } from "lucide-react";
import { useMemo, useState } from "react";
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

type ExpenseCategoryValue = (typeof expenseCategories)[number]["value"];

/** Set to true to always use dummy data (useful when testing chart layout) */
const USE_DUMMY_FOR_TESTING = false;

/**
 * Dummy expenses - expected structure for charts.
 * Use this as reference when shaping your backend API response.
 * Charts use this when expenses prop is empty (fallback for demo).
 *
 * Required fields per expense:
 * - id: string (unique)
 * - amount: number (in dollars/cents as needed)
 * - category: one of "food" | "transport" | "shopping" | "entertainment" | "bills" | "healthcare" | "education" | "travel" | "other"
 * - date: string (YYYY-MM-DD or ISO "YYYY-MM-DDTHH:mm:ssZ")
 * - description: string
 */
function getDummyExpenses(): Expense[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    const pad = (n: number) => String(n).padStart(2, "0");
    const date = (y: number, m: number, d: number) =>
        `${y}-${pad(m)}-${pad(d)}`;

    return [
        // Week 1 (current month)
        {
            id: "1",
            amount: 125.5,
            category: "food",
            date: date(year, month + 1, 2),
            description: "Grocery shopping",
        },
        {
            id: "2",
            amount: 24,
            category: "transport",
            date: date(year, month + 1, 3),
            description: "Uber ride",
        },
        {
            id: "3",
            amount: 89,
            category: "bills",
            date: date(year, month + 1, 4),
            description: "Electric bill",
        },
        // Week 2
        {
            id: "4",
            amount: 45,
            category: "healthcare",
            date: date(year, month + 1, 9),
            description: "Pharmacy",
        },
        {
            id: "5",
            amount: 12,
            category: "food",
            date: date(year, month + 1, 10),
            description: "Lunch",
        },
        {
            id: "6",
            amount: 250,
            category: "education",
            date: date(year, month + 1, 11),
            description: "Online course",
        },
        // Week 3
        {
            id: "7",
            amount: 180,
            category: "travel",
            date: date(year, month + 1, 16),
            description: "Hotel",
        },
        {
            id: "8",
            amount: 35,
            category: "transport",
            date: date(year, month + 1, 17),
            description: "Gas",
        },
        {
            id: "9",
            amount: 18.5,
            category: "food",
            date: date(year, month + 1, 18),
            description: "Dinner out",
        },
        {
            id: "10",
            amount: 15.99,
            category: "entertainment",
            date: date(year, month + 1, 18),
            description: "Netflix",
        },
        // Week 4
        {
            id: "11",
            amount: 32.99,
            category: "shopping",
            date: date(year, month + 1, 23),
            description: "Books",
        },
        {
            id: "12",
            amount: 42,
            category: "food",
            date: date(year, month + 1, 24),
            description: "Groceries",
        },
        {
            id: "13",
            amount: 120,
            category: "bills",
            date: date(year, month + 1, 25),
            description: "Internet",
        },
        {
            id: "14",
            amount: 55,
            category: "shopping",
            date: date(year, month + 1, 26),
            description: "Office supplies",
        },
        // Previous month (for trend comparison)
        {
            id: "15",
            amount: 95,
            category: "food",
            date: date(prevYear, prevMonth + 1, 10),
            description: "Previous month groceries",
        },
        {
            id: "16",
            amount: 45,
            category: "transport",
            date: date(prevYear, prevMonth + 1, 15),
            description: "Previous month transport",
        },
    ];
}

/**
 * Parses a date string (YYYY-MM-DD or ISO datetime) as local date.
 * Handles both "2024-02-15" and "2024-02-15T00:00:00Z" formats to avoid UTC timezone shifts.
 */
function parseLocalDate(dateStr: string): Date {
    const datePart = (dateStr.split("T")[0] ?? dateStr).trim();
    const [y, m, d] = datePart.split("-").map(Number);
    if (
        y == null ||
        m == null ||
        d == null ||
        isNaN(y) ||
        isNaN(m) ||
        isNaN(d)
    ) {
        return new Date(NaN);
    }
    return new Date(y, m - 1, d);
}

/**
 * Filters expenses to a specific calendar month (0-indexed).
 * Scalable for any year/month - used for current month, previous month, or date range selectors.
 */
function getMonthExpenses(
    expenses: Expense[],
    year: number,
    month: number,
): Expense[] {
    return expenses.filter((e) => {
        const d = parseLocalDate(e.date);
        return (
            !isNaN(d.getTime()) &&
            d.getFullYear() === year &&
            d.getMonth() === month
        );
    });
}

/**
 * Aggregates expenses by category into Recharts-compatible format.
 * Returns [{ name: "Food & Dining", value: 125.5, category: "food" }, ...]
 * sorted by value descending for consistent legend/chart ordering.
 */
function getCategoryTotals(expenses: Expense[]): {
    name: string;
    value: number;
    category: string;
}[] {
    const totals: Record<string, number> = {};
    for (const e of expenses) {
        totals[e.category] = (totals[e.category] ?? 0) + e.amount;
    }
    return Object.entries(totals)
        .map(([category, amount]) => ({
            name: getCategoryLabel(category as ExpenseCategoryValue),
            value: amount,
            category,
        }))
        .sort((a, b) => b.value - a.value);
}

/**
 * Groups expenses by week (Sunday start) for stacked bar chart.
 * Each row: { week: "Jan 1", "Food & Dining": 125, "Transportation": 24, ... }
 * Category keys use display labels for Recharts dataKey matching.
 */
function getWeeklyBreakdown(
    expenses: Expense[],
): Record<string, string | number>[] {
    const weeks: Record<string, Record<string, number>> = {};
    for (const e of expenses) {
        const d = parseLocalDate(e.date);
        if (isNaN(d.getTime())) continue;
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const key = weekStart.toISOString().slice(0, 10);
        if (!weeks[key]) weeks[key] = {};
        const label = getCategoryLabel(e.category as ExpenseCategoryValue);
        weeks[key][label] = (weeks[key][label] ?? 0) + e.amount;
    }
    return Object.entries(weeks)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, cats]) => ({
            week: new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            ...Object.fromEntries(Object.entries(cats).map(([c, v]) => [c, v])),
        }));
}

/**
 * Groups expenses by month for stacked bar chart (when period is "monthly").
 * Each row: { month: "Jan 2024", "Food & Dining": 125, ... }
 */
function getMonthlyBreakdown(
    expenses: Expense[],
): Record<string, string | number>[] {
    const months: Record<string, Record<string, number>> = {};
    for (const e of expenses) {
        const d = parseLocalDate(e.date);
        if (isNaN(d.getTime())) continue;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!months[key]) months[key] = {};
        const label = getCategoryLabel(e.category as ExpenseCategoryValue);
        months[key][label] = (months[key][label] ?? 0) + e.amount;
    }
    return Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dateKey, cats]) => {
            const [y, m] = dateKey.split("-").map(Number);
            const monthLabel = new Date(y!, m! - 1, 1).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric",
                },
            );
            return {
                month: monthLabel,
                ...Object.fromEntries(
                    Object.entries(cats).map(([c, v]) => [c, v]),
                ),
            };
        });
}

/**
 * Ensures all category labels appear in bar data rows (Recharts needs consistent keys for stacking).
 * Fills missing categories with 0 so stacked bars render correctly.
 */
function normalizeBarData(
    data: Record<string, string | number>[],
    categoryLabels: string[],
    labelKey: "week" | "month",
): Record<string, string | number>[] {
    return data.map((row) => {
        const normalized: Record<string, string | number> = {
            [labelKey]: row[labelKey],
        };
        for (const label of categoryLabels) {
            normalized[label] = (row[label] as number) ?? 0;
        }
        return normalized;
    });
}

function ApplicationCharts({
    expenses,
    selectedMonth,
}: {
    expenses: Expense[];
    /** YYYY-MM — must match dashboard month filter */
    selectedMonth: string;
}) {
    const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">(
        "weekly",
    );

    const expensesToUse = expenses;

    const [selYear, selMonth1] = selectedMonth.split("-").map(Number);
    const selMonth0 = (selMonth1 ?? 1) - 1;
    const year = selYear ?? new Date().getFullYear();

    const monthExpenses = useMemo(
        () => getMonthExpenses(expensesToUse, year, selMonth0),
        [expensesToUse, year, selMonth0],
    );

    const prevMonth0 = selMonth0 === 0 ? 11 : selMonth0 - 1;
    const prevYear = selMonth0 === 0 ? year - 1 : year;
    const prevMonthExpenses = useMemo(
        () => getMonthExpenses(expensesToUse, prevYear, prevMonth0),
        [expensesToUse, prevYear, prevMonth0],
    );

    const totalThisMonth = monthExpenses.reduce((s, e) => s + e.amount, 0);
    const totalPrevMonth = prevMonthExpenses.reduce((s, e) => s + e.amount, 0);
    const totalTrend =
        totalPrevMonth > 0
            ? ((totalThisMonth - totalPrevMonth) / totalPrevMonth) * 100
            : null;

    // Pie chart: category totals for current month
    const pieData = useMemo(
        () => getCategoryTotals(monthExpenses),
        [monthExpenses],
    );

    // Bar chart: weekly or monthly breakdown
    const rawBarData = useMemo(
        () =>
            chartPeriod === "weekly"
                ? getWeeklyBreakdown(monthExpenses)
                : getMonthlyBreakdown(monthExpenses),
        [monthExpenses, chartPeriod],
    );

    const barCategories = useMemo(() => pieData.map((c) => c.name), [pieData]);

    const barData = useMemo(
        () =>
            normalizeBarData(
                rawBarData,
                barCategories,
                chartPeriod === "weekly" ? "week" : "month",
            ),
        [rawBarData, barCategories, chartPeriod],
    );

    const barLabelKey = chartPeriod === "weekly" ? "week" : "month";

    return (
        <div>
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
                                            dataKey={barLabelKey}
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
                                            .slice(0, 8)
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
                                                        key={pieData[i]!.name}
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
                                    {pieData.slice(0, 8).map((item, i) => (
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
        </div>
    );
}

export default ApplicationCharts;
