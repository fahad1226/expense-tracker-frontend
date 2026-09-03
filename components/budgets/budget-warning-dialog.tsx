"use client";

import {
    formatBudgetPeriodLabel,
    type CategoryBudgetImpact,
} from "@/lib/budgets";
import { formatCurrency } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { AlertTriangleIcon, XIcon } from "lucide-react";

type BudgetWarningDialogProps = {
    open: boolean;
    impacts: CategoryBudgetImpact[];
    onConfirm: () => void;
    onCancel: () => void;
    confirming?: boolean;
};

const STATUS_LABELS = {
    ok: "Under budget",
    warning: "Close to limit",
    over: "Over budget",
} as const;

export default function BudgetWarningDialog({
    open,
    impacts,
    onConfirm,
    onCancel,
    confirming = false,
}: BudgetWarningDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-[1px]" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                <AlertTriangleIcon className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Budget warning
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    This expense will push at least one active
                                    budget close to or over its limit.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            aria-label="Close"
                        >
                            <XIcon className="size-5" />
                        </button>
                    </div>

                    <ul className="mt-6 space-y-3">
                        {impacts.map((impact) => (
                            <li
                                key={impact.budgetId}
                                className="rounded-xl border border-gray-200 bg-gray-50/60 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {impact.category.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {formatBudgetPeriodLabel({
                                                id: impact.budgetId,
                                                category: impact.category,
                                                amount: impact.amount,
                                                spent: impact.spent,
                                                remaining: impact.remaining,
                                                percentUsed: null,
                                                status: impact.currentStatus,
                                                lifecycleStatus: "active",
                                                periodType: impact.periodType,
                                                startsAt: impact.startsAt,
                                                endsAt: impact.endsAt,
                                                note: null,
                                                daysRemaining: null,
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                                            impact.projectedStatus === "over"
                                                ? "bg-red-50 text-red-700"
                                                : "bg-amber-50 text-amber-700",
                                        )}
                                    >
                                        {
                                            STATUS_LABELS[
                                                impact.projectedStatus
                                            ]
                                        }
                                    </span>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            Current spent
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(impact.spent)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            After expense
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(
                                                impact.projectedSpent,
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            Budget cap
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(impact.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            Remaining after
                                        </p>
                                        <p
                                            className={cn(
                                                "font-medium",
                                                impact.projectedRemaining < 0
                                                    ? "text-red-700"
                                                    : "text-gray-900",
                                            )}
                                        >
                                            {formatCurrency(
                                                impact.projectedRemaining,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex gap-2">
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={confirming}
                            className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:opacity-60"
                        >
                            {confirming ? "Adding…" : "Continue anyway"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
