"use client";

import {
    fetchAnalytics,
    formatAnalyticsRangeLabel,
    getRangeForPreset,
    type AnalyticsResponse,
} from "@/lib/analytics";
import { formatCurrency } from "@/lib/expenses";
import {
    defaultReportMonth,
    defaultReportQuarter,
    downloadReport,
    getReportRange,
    type ReportTypeId,
} from "@/lib/reports";
import { cn } from "@/lib/utils";
import {
    CalendarIcon,
    DownloadIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    MailIcon,
    PrinterIcon,
    ScrollTextIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const REPORT_TYPES = [
    { id: "monthly" as const, label: "Monthly summary" },
    { id: "quarter" as const, label: "Quarter" },
    { id: "custom" as const, label: "Custom range" },
    { id: "ytd" as const, label: "Year to date" },
];

const FORMATS = [
    { id: "pdf" as const, label: "PDF", icon: FileTextIcon },
    { id: "csv" as const, label: "CSV", icon: FileSpreadsheetIcon },
];

function initialCustomRange() {
    const r = getRangeForPreset("30d", "", "", new Date());
    return { start: r.start, end: r.end };
}

export default function ReportsPage() {
    const [reportType, setReportType] = useState<ReportTypeId>("monthly");
    const [month, setMonth] = useState(defaultReportMonth);
    const [{ year, quarter }, setYearQuarter] = useState(defaultReportQuarter);
    const [{ start: customStart, end: customEnd }, setCustomRange] = useState(
        initialCustomRange,
    );
    const [format, setFormat] = useState<"pdf" | "csv">("pdf");
    const [includeCategory, setIncludeCategory] = useState(true);
    const [includeTransactions, setIncludeTransactions] = useState(true);
    const [includeCompare, setIncludeCompare] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [preview, setPreview] = useState<AnalyticsResponse | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const { start: startDate, end: endDate } = useMemo(
        () =>
            getReportRange(reportType, {
                month,
                year,
                quarter,
                customStart,
                customEnd,
            }),
        [reportType, month, year, quarter, customStart, customEnd],
    );

    const loadPreview = useCallback(async () => {
        try {
            const data = await fetchAnalytics({
                startDate,
                endDate,
                granularity: "week",
                compare: includeCompare,
            });
            setPreview(data);
        } catch {
            setPreview(null);
        }
    }, [startDate, endDate, includeCompare]);

    useEffect(() => {
        void loadPreview();
    }, [loadPreview]);

    const rangeLabel = formatAnalyticsRangeLabel(startDate, endDate);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await downloadReport({
                startDate,
                endDate,
                format,
                includeCategoryBreakdown: includeCategory,
                includeTransactions,
                includeCompare,
            });
            toast.success("Report downloaded");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Download failed");
        } finally {
            setDownloading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const visibleCategories = includeCategory ? preview?.categoryMix ?? [] : [];
    const visibleTransactions = includeTransactions
        ? preview?.topDescriptions ?? []
        : [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between print:hidden">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Reports
                    </h1>
                    <p className="mt-0.5 max-w-xl text-sm text-gray-500">
                        Downloadable summaries for taxes, sharing, or your
                        records. Preview updates as you change the period and
                        options.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="space-y-6 print:hidden lg:col-span-5">
                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                        <div className="border-b border-gray-100 bg-gray-50/40 px-5 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <ScrollTextIcon className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Report type
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Preset period buckets
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 p-4">
                            {REPORT_TYPES.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setReportType(t.id)}
                                    className={cn(
                                        "rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                                        reportType === t.id
                                            ? "bg-violet-100 text-violet-800 ring-1 ring-violet-200/80"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                        <div className="border-b border-gray-100 bg-gray-50/40 px-5 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <CalendarIcon className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Period
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        {rangeLabel}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 p-4">
                            {reportType === "monthly" && (
                                <div>
                                    <label
                                        htmlFor="report-month"
                                        className="mb-1 block text-xs font-medium text-gray-600"
                                    >
                                        Month
                                    </label>
                                    <input
                                        id="report-month"
                                        type="month"
                                        value={month}
                                        onChange={(e) =>
                                            setMonth(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                    />
                                </div>
                            )}
                            {reportType === "quarter" && (
                                <div className="space-y-3">
                                    <div>
                                        <label
                                            htmlFor="report-year"
                                            className="mb-1 block text-xs font-medium text-gray-600"
                                        >
                                            Year
                                        </label>
                                        <input
                                            id="report-year"
                                            type="number"
                                            min={2000}
                                            max={2100}
                                            value={year}
                                            onChange={(e) =>
                                                setYearQuarter((prev) => ({
                                                    ...prev,
                                                    year: Number(
                                                        e.target.value,
                                                    ),
                                                }))
                                            }
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                        />
                                    </div>
                                    <div>
                                        <span className="mb-1 block text-xs font-medium text-gray-600">
                                            Quarter
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {(
                                                [1, 2, 3, 4] as const
                                            ).map((q) => (
                                                <button
                                                    key={q}
                                                    type="button"
                                                    onClick={() =>
                                                        setYearQuarter(
                                                            (prev) => ({
                                                                ...prev,
                                                                quarter: q,
                                                            }),
                                                        )
                                                    }
                                                    className={cn(
                                                        "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                                                        quarter === q
                                                            ? "bg-violet-100 text-violet-800 ring-1 ring-violet-200"
                                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100",
                                                    )}
                                                >
                                                    Q{q}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {reportType === "custom" && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) =>
                                            setCustomRange((prev) => ({
                                                ...prev,
                                                start: e.target.value,
                                            }))
                                        }
                                        className="rounded-lg border border-gray-200 px-2 py-2 text-sm"
                                    />
                                    <span className="text-gray-400">—</span>
                                    <input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) =>
                                            setCustomRange((prev) => ({
                                                ...prev,
                                                end: e.target.value,
                                            }))
                                        }
                                        className="rounded-lg border border-gray-200 px-2 py-2 text-sm"
                                    />
                                </div>
                            )}
                            {reportType === "ytd" && (
                                <p className="text-sm text-gray-600">
                                    Jan 1 through today in your local calendar
                                    range.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                        <div className="border-b border-gray-100 bg-gray-50/40 px-5 py-4">
                            <h2 className="text-base font-semibold text-gray-900">
                                Output format
                            </h2>
                            <p className="text-xs text-gray-500">
                                File type for download
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 p-4">
                            {FORMATS.map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setFormat(f.id)}
                                    className={cn(
                                        "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                                        format === f.id
                                            ? "border-violet-300 bg-violet-50 text-violet-900"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                                    )}
                                >
                                    <f.icon className="size-4 shrink-0" />
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                        <div className="border-b border-gray-100 bg-gray-50/40 px-5 py-4">
                            <h2 className="text-base font-semibold text-gray-900">
                                Options
                            </h2>
                            <p className="text-xs text-gray-500">
                                Included in the file and preview
                            </p>
                        </div>
                        <div className="space-y-2 p-4">
                            <OptionRow
                                label="Category breakdown"
                                checked={includeCategory}
                                onChange={setIncludeCategory}
                            />
                            <OptionRow
                                label="Itemized transactions in export"
                                checked={includeTransactions}
                                onChange={setIncludeTransactions}
                            />
                            <OptionRow
                                label="Compare to previous period"
                                checked={includeCompare}
                                onChange={setIncludeCompare}
                            />
                        </div>
                    </section>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                            type="button"
                            disabled={downloading}
                            onClick={() => void handleDownload()}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:opacity-60"
                        >
                            <DownloadIcon className="size-4" />
                            {downloading ? "Preparing…" : "Generate & download"}
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        >
                            <PrinterIcon className="size-4" />
                            Print
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            toast.message("Email reports are not set up yet.")
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-900"
                    >
                        <MailIcon className="size-4" />
                        Email report
                    </button>
                </div>

                <div className="lg:col-span-7">
                    <section
                        ref={printRef}
                        id="report-preview"
                        className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50 print:shadow-none"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/40 px-5 py-4 print:hidden">
                            <h2 className="text-base font-semibold text-gray-900">
                                Report preview
                            </h2>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                                Live
                            </span>
                        </div>

                        <div className="space-y-6 p-6">
                            {!preview ? (
                                <p className="text-center text-sm text-gray-500">
                                    Loading preview…
                                </p>
                            ) : preview.summary.totalSpend === 0 ? (
                                <p className="text-center text-sm text-gray-500">
                                    No expenses in this period. Exports will
                                    still include headers and zeros.
                                </p>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Expense report
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {rangeLabel}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <PreviewStat
                                            label="Total spend"
                                            value={formatCurrency(
                                                preview.summary.totalSpend,
                                            )}
                                        />
                                        <PreviewStat
                                            label="Avg / day"
                                            value={formatCurrency(
                                                preview.summary.avgPerDay,
                                            )}
                                        />
                                        <PreviewStat
                                            label="Transactions"
                                            value={String(
                                                preview.summary
                                                    .transactionCount,
                                            )}
                                        />
                                    </div>

                                    {includeCompare &&
                                        preview.summary.deltas && (
                                            <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 text-sm">
                                                <p className="font-semibold text-gray-900">
                                                    vs prior period
                                                </p>
                                                <ul className="mt-2 space-y-1 text-gray-600">
                                                    <li>
                                                        Total:{" "}
                                                        {preview.summary.deltas
                                                            .totalSpendPercent !=
                                                        null
                                                            ? `${preview.summary.deltas.totalSpendPercent > 0 ? "+" : ""}${preview.summary.deltas.totalSpendPercent.toFixed(1)}%`
                                                            : "—"}
                                                    </li>
                                                    <li>
                                                        Avg/day:{" "}
                                                        {preview.summary.deltas
                                                            .avgPerDayPercent !=
                                                        null
                                                            ? `${preview.summary.deltas.avgPerDayPercent > 0 ? "+" : ""}${preview.summary.deltas.avgPerDayPercent.toFixed(1)}%`
                                                            : "—"}
                                                    </li>
                                                </ul>
                                            </div>
                                        )}

                                    {includeCategory &&
                                        visibleCategories.length > 0 && (
                                            <div>
                                                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                                                    Category breakdown
                                                </h4>
                                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                                    <table className="min-w-full text-left text-sm">
                                                        <thead>
                                                            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                                                <th className="px-3 py-2">
                                                                    Category
                                                                </th>
                                                                <th className="px-3 py-2 text-right">
                                                                    Amount
                                                                </th>
                                                                <th className="px-3 py-2 text-right">
                                                                    %
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {visibleCategories
                                                                .slice(0, 8)
                                                                .map((c) => (
                                                                    <tr
                                                                        key={
                                                                            c.categoryId
                                                                        }
                                                                        className="border-b border-gray-50"
                                                                    >
                                                                        <td className="px-3 py-2 text-gray-800">
                                                                            {
                                                                                c.name
                                                                            }
                                                                        </td>
                                                                        <td className="px-3 py-2 text-right text-gray-800">
                                                                            {formatCurrency(
                                                                                c.amount,
                                                                            )}
                                                                        </td>
                                                                        <td className="px-3 py-2 text-right text-gray-500">
                                                                            {c.sharePercent.toFixed(
                                                                                1,
                                                                            )}
                                                                            %
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                    {includeTransactions &&
                                        visibleTransactions.length > 0 && (
                                            <div>
                                                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                                                    Top descriptions
                                                </h4>
                                                <p className="mb-2 text-xs text-gray-500">
                                                    Matches description groups in
                                                    analytics; the CSV/PDF
                                                    includes full line items
                                                    when enabled.
                                                </p>
                                                <ul className="space-y-2 text-sm">
                                                    {visibleTransactions
                                                        .slice(0, 6)
                                                        .map((row, i) => (
                                                            <li
                                                                key={`${row.description}-${i}`}
                                                                className="flex justify-between gap-2 border-b border-gray-100 pb-2"
                                                            >
                                                                <span className="text-gray-800">
                                                                    {
                                                                        row.description
                                                                    }
                                                                </span>
                                                                <span className="shrink-0 font-medium text-gray-900">
                                                                    {formatCurrency(
                                                                        row.totalAmount,
                                                                    )}
                                                                </span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function OptionRow({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/40 px-3 py-2.5 transition-colors hover:bg-gray-50">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-3">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-sm font-bold text-gray-900">{value}</p>
        </div>
    );
}
