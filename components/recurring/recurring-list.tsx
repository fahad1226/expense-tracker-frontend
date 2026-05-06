"use client";

import { apiClient } from "@/config/api.client";
import {
    formatRecurrenceLabel,
    type RecurringExpenseListRow,
} from "@/lib/recurring-expenses";
import { formatCurrency, getCategoryColor } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { MoreHorizontalIcon, PencilIcon, PlusIcon, RepeatIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RecurringExpenseList({
    items,
}: {
    items: RecurringExpenseListRow[];
}) {
    const [openId, setOpenId] = useState<string | null>(null);
    const router = useRouter();

    const deleteMut = useMutation({
        mutationFn: (id: string) => apiClient().delete(`/recurring-expenses/${id}`),
        onSuccess: () => {
            toast.success("Recurring expense removed");
            setOpenId(null);
            router.refresh();
        },
        onError: () => {
            toast.error("Could not delete. Check that your API is running.");
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Recurring expenses
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Scheduled charges you track automatically on the
                        server
                    </p>
                </div>
                <Link
                    href="/recurring/new"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700"
                >
                    <PlusIcon className="size-4" />
                    Add recurring
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/30 py-20">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-gray-100">
                        <RepeatIcon className="size-8 text-gray-400" />
                    </div>
                    <p className="mt-4 text-base font-medium text-gray-600">
                        No recurring expenses yet
                    </p>
                    <p className="mt-1 max-w-sm text-center text-sm text-gray-500">
                        Add rent, subscriptions, and bills so you only
                        set them up once. Your API should expose{" "}
                        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs">
                            GET/POST /recurring-expenses
                        </code>
                    </p>
                    <Link
                        href="/recurring/new"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                    >
                        <PlusIcon className="size-4" />
                        Create your first
                    </Link>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Name
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Category
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Schedule
                                    </th>
                                    <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="w-12 px-6 py-3.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="group transition-colors hover:bg-gray-50/80"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                                    <RepeatIcon className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {r.note}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        From{" "}
                                                        {r.startDate}
                                                        {r.endDate
                                                            ? ` · until ${r.endDate}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                                                    getCategoryColor(
                                                        r.categoryValue ?? "other",
                                                    ),
                                                )}
                                            >
                                                {r.categoryName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatRecurrenceLabel(
                                                r.frequency,
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            {formatCurrency(r.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={cn(
                                                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                    r.isActive
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-gray-100 text-gray-600",
                                                )}
                                            >
                                                {r.isActive
                                                    ? "Active"
                                                    : "Paused"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenId(
                                                            openId === r.id
                                                                ? null
                                                                : r.id,
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-gray-400 transition-opacity hover:bg-gray-100 hover:text-gray-600"
                                                >
                                                    <MoreHorizontalIcon className="size-4" />
                                                </button>
                                                {openId === r.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() =>
                                                                setOpenId(null)
                                                            }
                                                            aria-hidden
                                                        />
                                                        <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                                                            <Link
                                                                href={`/recurring/${r.id}/edit`}
                                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                                                onClick={() =>
                                                                    setOpenId(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                <PencilIcon className="size-4" />
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                                                disabled={
                                                                    deleteMut.isPending
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        !confirm(
                                                                            "Remove this recurring rule?",
                                                                        )
                                                                    )
                                                                        return;
                                                                    deleteMut.mutate(
                                                                        r.id,
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2Icon className="size-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
