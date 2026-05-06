import type { ReactNode } from "react";

/**
 * Styled in-app previews for the marketing page. To use real screenshots instead,
 * replace the inner content with next/image pointing at e.g. /landing/dashboard.png.
 */

export function BrowserChromeFrame({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-2 shadow-2xl shadow-violet-900/10 ring-1 ring-black/5">
            <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
                <span className="size-3 rounded-full bg-red-400/90" />
                <span className="size-3 rounded-full bg-amber-400/90" />
                <span className="size-3 rounded-full bg-emerald-400/90" />
                <div className="ml-3 flex-1 rounded-md bg-gray-100 py-1 text-center text-[10px] font-medium text-gray-400">
                    app.expensetracker.com
                </div>
            </div>
            <div className="overflow-hidden rounded-xl bg-gray-50">{children}</div>
        </div>
    );
}

export function DashboardPreviewMock() {
    return (
        <BrowserChromeFrame>
            <div className="flex min-h-[280px] sm:min-h-[320px]">
                <aside className="hidden w-40 shrink-0 border-r border-gray-200/80 bg-violet-50/80 p-3 sm:block">
                    <div className="h-2 w-16 rounded bg-violet-200" />
                    <div className="mt-4 space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`h-2 rounded ${i === 1 ? "bg-violet-600" : "bg-violet-200/60"}`}
                                style={{ width: `${70 + i * 5}%` }}
                            />
                        ))}
                    </div>
                </aside>
                <div className="min-w-0 flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                Dashboard
                            </div>
                            <div className="mt-1 text-lg font-bold text-gray-900">
                                This month
                            </div>
                        </div>
                        <div className="rounded-lg bg-violet-600 px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm">
                            + Add expense
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { label: "Spent", v: "$2,847", d: "−8% vs last" },
                            { label: "Categories", v: "12", d: "Active" },
                            { label: "Budget", v: "74%", d: "On track" },
                        ].map((c) => (
                            <div
                                key={c.label}
                                className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                            >
                                <div className="text-[9px] font-medium text-gray-500">
                                    {c.label}
                                </div>
                                <div className="mt-1 text-base font-bold tabular-nums text-gray-900">
                                    {c.v}
                                </div>
                                <div className="mt-0.5 text-[8px] text-emerald-600">
                                    {c.d}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                        <div className="text-[9px] font-semibold text-gray-500">
                            Spending overview
                        </div>
                        <div className="mt-3 flex h-16 items-end justify-between gap-1 px-1">
                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 rounded-t bg-gradient-to-t from-violet-600 to-violet-400 opacity-90"
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </BrowserChromeFrame>
    );
}

export function AnalyticsPreviewMock() {
    return (
        <BrowserChromeFrame>
            <div className="min-h-[280px] space-y-4 p-4 sm:min-h-[320px] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            Analytics
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                            Trends & categories
                        </div>
                    </div>
                    <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-0.5 text-[9px] font-semibold text-gray-600">
                        {["7d", "30d", "3m"].map((t, i) => (
                            <span
                                key={t}
                                className={`rounded-md px-2 py-1 ${i === 2 ? "bg-violet-600 text-white" : ""}`}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[
                        { k: "Total spend", v: "$4,120" },
                        { k: "Avg / day", v: "$52" },
                        { k: "Top category", v: "Food" },
                    ].map((x) => (
                        <div
                            key={x.k}
                            className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                        >
                            <div className="text-[9px] text-gray-500">{x.k}</div>
                            <div className="mt-0.5 text-sm font-bold text-gray-900">
                                {x.v}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="text-[9px] font-semibold text-gray-500">
                        Spend over time
                    </div>
                    <div className="relative mt-3 h-24">
                        <svg
                            viewBox="0 0 400 96"
                            className="h-full w-full"
                            preserveAspectRatio="none"
                            aria-hidden
                        >
                            <defs>
                                <linearGradient
                                    id="landArea"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="rgb(139, 92, 246)"
                                        stopOpacity="0.35"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="rgb(139, 92, 246)"
                                        stopOpacity="0"
                                    />
                                </linearGradient>
                            </defs>
                            <path
                                fill="url(#landArea)"
                                d="M0,80 L40,72 L80,60 L120,68 L160,45 L200,52 L240,38 L280,48 L320,28 L360,40 L400,25 L400,96 L0,96 Z"
                            />
                            <path
                                fill="none"
                                stroke="rgb(124, 58, 237)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M0,80 L40,72 L80,60 L120,68 L160,45 L200,52 L240,38 L280,48 L320,28 L360,40 L400,25"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </BrowserChromeFrame>
    );
}

/** Floating phone silhouette with simplified dashboard strip — optional visual depth in hero */
export function PhonePreviewOutline() {
    return (
        <div className="relative mx-auto w-[140px] shrink-0 sm:w-[160px]">
            <div className="rounded-[1.75rem] border-4 border-gray-800 bg-gray-900 p-1.5 shadow-xl">
                <div className="overflow-hidden rounded-[1.25rem] bg-gray-50">
                    <div className="space-y-2 p-3">
                        <div className="h-2 w-1/2 rounded bg-gray-300" />
                        <div className="h-16 rounded-lg bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="p-2">
                                <div className="h-1.5 w-2/3 rounded bg-violet-200" />
                                <div className="mt-2 flex gap-1">
                                    <div className="h-8 flex-1 rounded bg-violet-500/20" />
                                    <div className="h-8 flex-1 rounded bg-gray-100" />
                                </div>
                            </div>
                        </div>
                        <div className="h-12 rounded-lg bg-violet-600/15" />
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-gray-400/40" />
        </div>
    );
}
