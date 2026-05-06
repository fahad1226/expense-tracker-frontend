import { getRangeForPreset } from "@/lib/analytics";
import { apiClient } from "@/config/api.client";
import { toISODate } from "@/lib/expenses";

export type ReportTypeId = "monthly" | "quarter" | "custom" | "ytd";

export function defaultReportMonth(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function defaultReportQuarter(): { year: number; quarter: 1 | 2 | 3 | 4 } {
    const d = new Date();
    const q = (Math.floor(d.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
    return { year: d.getFullYear(), quarter: q };
}

export function getReportRange(
    reportType: ReportTypeId,
    opts: {
        month: string;
        year: number;
        quarter: 1 | 2 | 3 | 4;
        customStart: string;
        customEnd: string;
    },
): { start: string; end: string } {
    switch (reportType) {
        case "monthly": {
            const [y, m] = opts.month.split("-").map(Number);
            if (
                y == null ||
                m == null ||
                Number.isNaN(y) ||
                Number.isNaN(m)
            ) {
                const fallback = defaultReportMonth().split("-").map(Number);
                const fy = fallback[0]!;
                const fm = fallback[1]!;
                const start = new Date(fy, fm - 1, 1);
                const end = new Date(fy, fm, 0);
                return { start: toISODate(start), end: toISODate(end) };
            }
            const start = new Date(y, m - 1, 1);
            const end = new Date(y, m, 0);
            return { start: toISODate(start), end: toISODate(end) };
        }
        case "quarter": {
            const y = opts.year;
            const q = opts.quarter;
            const startMonth = (q - 1) * 3;
            const start = new Date(y, startMonth, 1);
            const end = new Date(y, startMonth + 3, 0);
            return { start: toISODate(start), end: toISODate(end) };
        }
        case "custom":
            return { start: opts.customStart, end: opts.customEnd };
        case "ytd":
            return getRangeForPreset("ytd", "", "");
        default:
            return getRangeForPreset("3m", "", "");
    }
}

export async function downloadReport(params: {
    startDate: string;
    endDate: string;
    format: "csv" | "pdf";
    includeCategoryBreakdown: boolean;
    includeTransactions: boolean;
    includeCompare: boolean;
}): Promise<void> {
    const client = apiClient();
    const response = await client.get<Blob>("/reports/export", {
        params: {
            start_date: params.startDate,
            end_date: params.endDate,
            format: params.format,
            include_category_breakdown: params.includeCategoryBreakdown
                ? 1
                : 0,
            include_transactions: params.includeTransactions ? 1 : 0,
            include_compare: params.includeCompare ? 1 : 0,
        },
        responseType: "blob",
        validateStatus: () => true,
    });

    if (response.status >= 400) {
        let message = "Export failed";
        try {
            const text = await (response.data as Blob).text();
            const j = JSON.parse(text) as { message?: string };
            if (j.message) message = j.message;
        } catch {
            /* keep default */
        }
        throw new Error(message);
    }

    const blob = response.data as Blob;
    const ext = params.format;
    const filename = `expense-report-${params.startDate}-to-${params.endDate}.${ext}`;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}
