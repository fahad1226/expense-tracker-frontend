import { apiClient } from "@/config/api.client";
import { toISODate } from "@/lib/expenses";

export const ANALYTICS_CHART_COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#64748b",
];

export type AnalyticsGranularity = "day" | "week";

export type AnalyticsRangePreset =
    | "7d"
    | "30d"
    | "3m"
    | "6m"
    | "12m"
    | "ytd"
    | "custom";

export type AnalyticsTopCategory = {
    categoryId: number;
    name: string;
    amount: number;
    sharePercent: number;
};

export type AnalyticsSummary = {
    totalSpend: number;
    avgPerDay: number;
    transactionCount: number;
    topCategory: AnalyticsTopCategory | null;
    deltas: {
        totalSpendPercent: number | null;
        avgPerDayPercent: number | null;
        transactionCountPercent: number | null;
    } | null;
};

export type AnalyticsTimeSeries = {
    granularity: AnalyticsGranularity;
    points: Array<{ periodStart: string; label: string; total: number }>;
};

export type AnalyticsCategoryRow = {
    categoryId: number;
    name: string;
    amount: number;
    sharePercent: number;
};

export type AnalyticsDayOfWeek = {
    day: number;
    label: string;
    total: number;
};

export type AnalyticsDescriptionRow = {
    description: string;
    transactionCount: number;
    totalAmount: number;
};

export type AnalyticsResponse = {
    period: { start: string; end: string; days: number };
    comparePeriod: { start: string; end: string } | null;
    granularity: AnalyticsGranularity;
    summary: AnalyticsSummary;
    timeSeries: AnalyticsTimeSeries;
    categoryMix: AnalyticsCategoryRow[];
    dayOfWeek: AnalyticsDayOfWeek[];
    topDescriptions: AnalyticsDescriptionRow[];
    recurringVsVariable: {
        recurringAmount: number;
        variableAmount: number;
        hasRecurringData: boolean;
        message?: string;
    };
};

/** Inclusive range for a preset (end = today in local calendar). */
export function getRangeForPreset(
    preset: AnalyticsRangePreset,
    customStart: string,
    customEnd: string,
    ref: Date = new Date(),
): { start: string; end: string } {
    const end = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());

    if (preset === "custom") {
        return { start: customStart, end: customEnd };
    }

    const start = new Date(end);

    switch (preset) {
        case "7d":
            start.setDate(start.getDate() - 6);
            break;
        case "30d":
            start.setDate(start.getDate() - 29);
            break;
        case "3m":
            start.setMonth(start.getMonth() - 3);
            break;
        case "6m":
            start.setMonth(start.getMonth() - 6);
            break;
        case "12m":
            start.setMonth(start.getMonth() - 12);
            break;
        case "ytd":
            start.setTime(end.getTime());
            start.setMonth(0, 1);
            break;
        default:
            start.setMonth(start.getMonth() - 3);
    }

    return { start: toISODate(start), end: toISODate(end) };
}

export async function fetchAnalytics(params: {
    startDate: string;
    endDate: string;
    granularity: AnalyticsGranularity;
    compare: boolean;
}): Promise<AnalyticsResponse> {
    const { data } = await apiClient().get<AnalyticsResponse>("/analytics", {
        params: {
            start_date: params.startDate,
            end_date: params.endDate,
            granularity: params.granularity,
            compare: params.compare ? 1 : 0,
        },
    });
    return data;
}

export function formatAnalyticsRangeLabel(start: string, end: string): string {
    const s = new Date(`${start}T12:00:00`);
    const e = new Date(`${end}T12:00:00`);
    const sameYear = s.getFullYear() === e.getFullYear();
    const opts: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        ...(sameYear ? {} : { year: "numeric" }),
    };
    const left = s.toLocaleDateString("en-US", opts);
    const right = e.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    return `${left} — ${right}`;
}
