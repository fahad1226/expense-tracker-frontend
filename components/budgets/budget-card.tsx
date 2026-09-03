"use client";

import {
    formatBudgetPeriodLabel,
    type BudgetLifecycleStatus,
    type BudgetStatus,
    type CategoryBudget,
} from "@/lib/budgets";
import { CategoryGlyph } from "@/lib/category-icons";
import { formatCurrency } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import {
    AlertTriangleIcon,
    ClockIcon,
    MoreHorizontalIcon,
    PencilIcon,
    Trash2Icon,
} from "lucide-react";
import { useState } from "react";

const STATUS_COPY: Record<
    Exclude<BudgetStatus, "unset">,
    { label: string; chipClass: string; barClass: string; ringClass: string }
> = {
    ok: {
        label: "On track",
        chipClass: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
        barClass: "bg-gradient-to-r from-emerald-400 to-emerald-500",
        ringClass: "stroke-emerald-500",
    },
    warning: {
        label: "Near limit",
        chipClass: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
        barClass: "bg-gradient-to-r from-amber-400 to-amber-500",
        ringClass: "stroke-amber-500",
    },
    over: {
        label: "Over budget",
        chipClass: "bg-red-500/10 text-red-700 ring-red-500/20",
        barClass: "bg-gradient-to-r from-red-400 to-red-500",
        ringClass: "stroke-red-500",
    },
};

const LIFECYCLE_COPY: Record<
    BudgetLifecycleStatus,
    { label: string; chipClass: string }
> = {
    active: {
        label: "Active",
        chipClass: "bg-violet-500/10 text-violet-700",
    },
    upcoming: {
        label: "Upcoming",
        chipClass: "bg-sky-500/10 text-sky-700",
    },
    expired: {
        label: "Expired",
        chipClass: "bg-gray-500/10 text-gray-600",
    },
};

type BudgetCardProps = {
    budget: CategoryBudget;
    onEdit: (budget: CategoryBudget) => void;
    onDelete: (budget: CategoryBudget) => void;
};

function ProgressRing({
    percent,
    status,
}: {
    percent: number;
    status: Exclude<BudgetStatus, "unset">;
}) {
    const clamped = Math.min(100, Math.max(0, percent));
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <div className="relative size-16 shrink-0">
            <svg className="-rotate-90 size-16" viewBox="0 0 64 64">
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    strokeWidth="5"
                    className="stroke-gray-100"
                />
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={cn(
                        "transition-all duration-500",
                        STATUS_COPY[status].ringClass,
                    )}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                {percent.toFixed(0)}%
            </span>
        </div>
    );
}

export default function BudgetCard({
    budget,
    onEdit,
    onDelete,
}: BudgetCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const statusMeta = STATUS_COPY[budget.status];
    const lifecycleMeta = LIFECYCLE_COPY[budget.lifecycleStatus];
    const progressPercent =
        budget.percentUsed != null ? Math.min(100, budget.percentUsed) : 0;
    const barOverflow = budget.percentUsed != null && budget.percentUsed > 100;

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200/60 hover:shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-400 via-violet-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-600 ring-1 ring-violet-100">
                            <CategoryGlyph
                                iconId={budget.category.icon}
                                className="size-5"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-semibold tracking-tight text-gray-900">
                                {budget.category.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-500">
                                {formatBudgetPeriodLabel(budget)}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                <span
                                    className={cn(
                                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                        lifecycleMeta.chipClass,
                                    )}
                                >
                                    {lifecycleMeta.label}
                                </span>
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset",
                                        statusMeta.chipClass,
                                    )}
                                >
                                    {budget.status === "over" && (
                                        <AlertTriangleIcon className="size-3" />
                                    )}
                                    {statusMeta.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            aria-label="Budget actions"
                        >
                            <MoreHorizontalIcon className="size-4" />
                        </button>
                        {menuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setMenuOpen(false)}
                                    aria-hidden
                                />
                                <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onEdit(budget);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <PencilIcon className="size-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onDelete(budget);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2Icon className="size-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-4">
                    <ProgressRing
                        percent={budget.percentUsed ?? 0}
                        status={budget.status}
                    />
                    <div className="grid min-w-0 flex-1 grid-cols-3 gap-2">
                        <Stat
                            label="Budget"
                            value={formatCurrency(budget.amount)}
                        />
                        <Stat
                            label="Spent"
                            value={formatCurrency(budget.spent)}
                            highlight
                        />
                        <Stat
                            label="Left"
                            value={formatCurrency(budget.remaining)}
                            danger={budget.remaining < 0}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                statusMeta.barClass,
                            )}
                            style={{
                                width: `${barOverflow ? 100 : progressPercent}%`,
                            }}
                        />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        {budget.daysRemaining != null ? (
                            <span className="inline-flex items-center gap-1">
                                <ClockIcon className="size-3" />
                                {budget.daysRemaining} day
                                {budget.daysRemaining === 1 ? "" : "s"} left
                            </span>
                        ) : (
                            <span />
                        )}
                        <span className="font-medium text-gray-600">
                            {formatCurrency(budget.spent)} of{" "}
                            {formatCurrency(budget.amount)}
                        </span>
                    </div>
                    {budget.note && (
                        <p className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-600">
                            {budget.note}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

function Stat({
    label,
    value,
    highlight,
    danger,
}: {
    label: string;
    value: string;
    highlight?: boolean;
    danger?: boolean;
}) {
    return (
        <div
            className={cn(
                "rounded-xl px-2.5 py-2",
                highlight ? "bg-violet-50/80" : "bg-gray-50/80",
            )}
        >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
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
    );
}
