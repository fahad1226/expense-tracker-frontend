"use client";

import {
    ANALYTICS_CHART_COLORS,
    type AnalyticsGranularity,
    type AnalyticsRangePreset,
    type AnalyticsResponse,
    fetchAnalytics,
    formatAnalyticsRangeLabel,
    getRangeForPreset,
} from "@/lib/analytics";
import { formatCurrency } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import {
    ArrowDownIcon,
    ArrowLeftRightIcon,
    ArrowUpIcon,
    CalendarRangeIcon,
    LayoutGridIcon,
    LineChartIcon,
    PieChartIcon,
    ReceiptIcon,
    RepeatIcon,
    SparklesIcon,
    TrendingUpIcon,
    WalletIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { toast } from "sonner";

const RANGE_PRESETS = [
    { id: "7d" as const, label: "7d" },
    { id: "30d" as const, label: "30d" },
    { id: "3m" as const, label: "3m" },
    { id: "6m" as const, label: "6m" },
    { id: "12m" as const, label: "12m" },
    { id: "ytd" as const, label: "YTD" },
    { id: "custom" as const, label: "Custom" },
];

function initialCustomRange() {
    const { start, end } = getRangeForPreset("3m", "", "");
    return { start, end };
}

export default function AnalyticsPage() {
    const [range, setRange] = useState<AnalyticsRangePreset>("3m");
    const [{ start: customStart, end: customEnd }, setCustomRange] =
        useState(initialCustomRange);
    const [compareOn, setCompareOn] = useState(false);
    const [granularity, setGranularity] =
        useState<AnalyticsGranularity>("week");
    const [data, setData] = useState<AnalyticsResponse | null>(null);

    const { start: startDate, end: endDate } = useMemo(
        () => getRangeForPreset(range, customStart, customEnd),
        [range, customStart, customEnd],
    );

    const load = useCallback(async () => {
        try {
            const res = await fetchAnalytics({
                startDate,
                endDate,
                granularity,
                compare: compareOn,
            });
            setData(res);
        } catch {
            toast.error("Could not load analytics. Check your connection.");
            setData(null);
        }
    }, [startDate, endDate, granularity, compareOn]);

    useEffect(() => {
        void load();
    }, [load]);

    const rangeLabel = data
        ? formatAnalyticsRangeLabel(data.period.start, data.period.end)
        : formatAnalyticsRangeLabel(startDate, endDate);

    const isEmpty = data && data.summary.totalSpend === 0;
    const deltas = data?.summary.deltas;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Analytics
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Trends, categories, and recurring commitments
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <div
                        className="flex flex-wrap gap-1 rounded-xl border border-gray-200/80 bg-gray-50/80 p-1"
                        role="group"
                        aria-label="Date range"
                    >
                        {RANGE_PRESETS.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                    setRange(p.id);
                                    if (p.id !== "custom") {
                                        const r = getRangeForPreset(
                                            p.id,
                                            customStart,
                                            customEnd,
                                        );
                                        setCustomRange(r);
                                    }
                                }}
                                className={cn(
                                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                                    range === p.id
                                        ? "bg-white text-violet-700 shadow-sm ring-1 ring-gray-200/80"
                                        : "text-gray-600 hover:bg-white/60 hover:text-gray-900",
                                )}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {range === "custom" ? (
                            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
                                <label
                                    className="sr-only"
                                    htmlFor="analytics-start"
                                >
                                    Start date
                                </label>
                                <input
                                    id="analytics-start"
                                    type="date"
                                    value={customStart}
                                    onChange={(e) =>
                                        setCustomRange((prev) => ({
                                            ...prev,
                                            start: e.target.value,
                                        }))
                                    }
                                    className="rounded border-0 bg-transparent text-sm text-gray-700 outline-none"
                                />
                                <span className="text-gray-400">—</span>
                                <label
                                    className="sr-only"
                                    htmlFor="analytics-end"
                                >
                                    End date
                                </label>
                                <input
                                    id="analytics-end"
                                    type="date"
                                    value={customEnd}
                                    onChange={(e) =>
                                        setCustomRange((prev) => ({
                                            ...prev,
                                            end: e.target.value,
                                        }))
                                    }
                                    className="rounded border-0 bg-transparent text-sm text-gray-700 outline-none"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm">
                                <CalendarRangeIcon className="size-4 text-gray-500" />
                                <span>{rangeLabel}</span>
                            </div>
                        )}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={compareOn}
                            onClick={() => setCompareOn(!compareOn)}
                            className={cn(
                                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-colors",
                                compareOn
                                    ? "border-violet-200 bg-violet-50 text-violet-800"
                                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                            )}
                        >
                            <ArrowLeftRightIcon className="size-4 shrink-0" />
                            Compare prior period
                        </button>
                    </div>
                </div>
            </div>

            {data?.comparePeriod && compareOn && (
                <p className="text-xs text-gray-500">
                    Compared to{" "}
                    {formatAnalyticsRangeLabel(
                        data.comparePeriod.start,
                        data.comparePeriod.end,
                    )}
                </p>
            )}

            {isEmpty && (
                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
                    <p className="text-sm font-medium text-gray-700">
                        No expenses in this range
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Try a wider range or add expenses to see analytics.
                    </p>
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Total spend"
                    value={formatCurrency(data?.summary.totalSpend ?? 0)}
                    icon={WalletIcon}
                    trendPercent={deltas?.totalSpendPercent}
                    invertTrend
                />
                <SummaryCard
                    title="Avg. per day"
                    value={formatCurrency(data?.summary.avgPerDay ?? 0)}
                    icon={TrendingUpIcon}
                    trendPercent={deltas?.avgPerDayPercent}
                    invertTrend
                />
                <SummaryCard
                    title="Top category"
                    value={data?.summary.topCategory?.name ?? "—"}
                    subValue={
                        data?.summary.topCategory
                            ? `${data.summary.topCategory.sharePercent.toFixed(1)}% of spend · ${formatCurrency(data.summary.topCategory.amount)}`
                            : undefined
                    }
                    icon={PieChartIcon}
                />
                <SummaryCard
                    title="Transactions"
                    value={String(data?.summary.transactionCount ?? 0)}
                    subValue={
                        data?.summary.transactionCount
                            ? `Avg ${formatCurrency((data.summary.totalSpend ?? 0) / data.summary.transactionCount)} each`
                            : undefined
                    }
                    icon={ReceiptIcon}
                    trendPercent={deltas?.transactionCountPercent}
                    invertTrend
                />
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <LineChartIcon className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Spending over time
                            </h2>
                            <p className="text-xs text-gray-500">
                                Daily or weekly totals by period
                            </p>
                        </div>
                    </div>
                    <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => setGranularity("week")}
                            className={cn(
                                "rounded-md px-2.5 py-1 transition-colors",
                                granularity === "week"
                                    ? "bg-violet-100 text-violet-800"
                                    : "text-gray-500 hover:text-gray-800",
                            )}
                        >
                            By week
                        </button>
                        <button
                            type="button"
                            onClick={() => setGranularity("day")}
                            className={cn(
                                "rounded-md px-2.5 py-1 transition-colors",
                                granularity === "day"
                                    ? "bg-violet-100 text-violet-800"
                                    : "text-gray-500 hover:text-gray-800",
                            )}
                        >
                            By day
                        </button>
                    </div>
                </div>
                <div className="h-[300px] px-4 pb-4 pt-2">
                    {data && data.timeSeries.points.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.timeSeries.points}>
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 11 }}
                                    stroke="#9ca3af"
                                />
                                <YAxis
                                    tick={{ fontSize: 11 }}
                                    stroke="#9ca3af"
                                    tickFormatter={(v) =>
                                        `$${Number(v).toLocaleString()}`
                                    }
                                />
                                <Tooltip
                                    formatter={(value: number | string) =>
                                        formatCurrency(Number(value))
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#7c3aed"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                            No data for this range
                        </div>
                    )}
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                    <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <PieChartIcon className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Category mix
                            </h2>
                            <p className="text-xs text-gray-500">
                                Share of wallet for this range
                            </p>
                        </div>
                    </div>
                    <div className="h-[260px] px-4 pb-4">
                        {data && data.categoryMix.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.categoryMix}
                                        dataKey="amount"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={48}
                                        outerRadius={88}
                                        paddingAngle={2}
                                    >
                                        {data.categoryMix.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={
                                                    ANALYTICS_CHART_COLORS[
                                                        i %
                                                            ANALYTICS_CHART_COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number | string) =>
                                            formatCurrency(Number(value))
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                No categories in this range
                            </div>
                        )}
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                    <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <RepeatIcon className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Recurring vs variable
                            </h2>
                            <p className="text-xs text-gray-500">
                                Server-side recurring data not available yet
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4 p-6">
                        {data && (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        One-off (this range)
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {formatCurrency(
                                            data.recurringVsVariable
                                                .variableAmount,
                                        )}
                                    </span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-violet-500"
                                        style={{
                                            width: "100%",
                                        }}
                                        title="Variable spend"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    {data.recurringVsVariable.message ??
                                        "When recurring expenses sync from the server, this split will update automatically."}
                                </p>
                            </>
                        )}
                    </div>
                </section>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                    <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <LayoutGridIcon className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Day-of-week pattern
                            </h2>
                            <p className="text-xs text-gray-500">
                                Where spend tends to land (Mon–Sun)
                            </p>
                        </div>
                    </div>
                    <div className="h-[220px] px-4 pb-4">
                        {data && data.dayOfWeek.some((d) => d.total > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.dayOfWeek}>
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fontSize: 11 }}
                                        stroke="#9ca3af"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11 }}
                                        stroke="#9ca3af"
                                        tickFormatter={(v) =>
                                            `$${Number(v).toLocaleString()}`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value: number | string) =>
                                            formatCurrency(Number(value))
                                        }
                                    />
                                    <Bar
                                        dataKey="total"
                                        fill="#8b5cf6"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                No spending pattern for this range
                            </div>
                        )}
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                    <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <SparklesIcon className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Top descriptions
                            </h2>
                            <p className="text-xs text-gray-500">
                                By total amount in this range
                            </p>
                        </div>
                    </div>
                    <div className="max-h-[280px] space-y-2 overflow-y-auto p-6">
                        {data?.topDescriptions.length ? (
                            data.topDescriptions.map((row, i) => (
                                <div
                                    key={`${row.description}-${i}`}
                                    className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3"
                                >
                                    <span className="min-w-0 flex-1 text-sm font-medium text-gray-900">
                                        {row.description}
                                    </span>
                                    <div className="shrink-0 text-right text-sm">
                                        <div className="font-semibold text-gray-900">
                                            {formatCurrency(row.totalAmount)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {row.transactionCount} tx
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-500">
                                No descriptions in this range
                            </p>
                        )}
                    </div>
                </section>
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                <div className="border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-900">
                        Category breakdown
                    </h2>
                    <p className="text-xs text-gray-500">
                        Amount and share for the selected range
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Share</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data?.categoryMix.length ? (
                                data.categoryMix.map((c) => (
                                    <tr
                                        key={c.categoryId}
                                        className="hover:bg-gray-50/80"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {c.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {formatCurrency(c.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {c.sharePercent.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/30 px-6 py-5">
                <p className="text-sm font-medium text-violet-900">
                    Budget vs actual
                </p>
                <p className="mt-1 text-sm text-violet-800/80">
                    When budgets are live, you can surface variance and pacing
                    here next to these trends.
                </p>
            </section>
        </div>
    );
}

function SummaryCard({
    title,
    value,
    subValue,
    icon: Icon,
    trendPercent,
    invertTrend,
}: {
    title: string;
    value: string;
    subValue?: string;
    icon: ComponentType<{ className?: string }>;
    trendPercent?: number | null;
    invertTrend?: boolean;
}) {
    const trendColor =
        trendPercent == null
            ? ""
            : invertTrend
              ? trendPercent >= 0
                  ? "text-red-600"
                  : "text-emerald-600"
              : trendPercent >= 0
                ? "text-emerald-600"
                : "text-red-600";

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
                        <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">
                            {subValue}
                        </p>
                    )}
                    {trendPercent != null && (
                        <p
                            className={cn(
                                "mt-2 inline-flex items-center gap-1 text-sm font-semibold",
                                trendColor,
                            )}
                        >
                            {trendPercent >= 0 ? (
                                <ArrowUpIcon className="size-4" />
                            ) : (
                                <ArrowDownIcon className="size-4" />
                            )}
                            {Math.abs(trendPercent).toFixed(1)}% vs prior
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
