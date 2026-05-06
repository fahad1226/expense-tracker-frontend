"use client";

import { apiClient } from "@/config/api.client";
import { CategoryGlyph } from "@/lib/category-icons";
import {
    RECURRENCE_FREQUENCIES,
    type RecurrenceFrequency,
} from "@/lib/recurring-expenses";
import { toISODate } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { differenceInCalendarDays } from "date-fns";
import { ArrowLeftIcon, CalendarIcon, RepeatIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { toast } from "sonner";

type CategoryType = {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
};

type FormState = {
    amount: string;
    note: string;
    category_id: number | null;
    frequency: RecurrenceFrequency;
    start_date: Date;
    end_date: Date | null;
    has_end: boolean;
    is_active: boolean;
};

type Props = {
    categories: CategoryType[];
    mode: "create" | "edit";
    recurringId?: string;
    initial?: {
        amount: number;
        note: string;
        category_id: number;
        frequency: RecurrenceFrequency;
        start_date: string;
        end_date: string | null;
        is_active: boolean;
    };
};

function parseISODate(d: string): Date {
    const [y, m, day] = d.split("-").map(Number);
    if (!y || !m || !day) return new Date();
    return new Date(y, m - 1, day);
}

export default function RecurringExpenseForm({
    categories,
    mode,
    recurringId,
    initial,
}: Props) {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(() => ({
        amount:
            initial != null
                ? String(initial.amount)
                : "",
        note: initial?.note ?? "",
        category_id: initial?.category_id ?? categories[0]?.id ?? null,
        frequency: initial?.frequency ?? "monthly",
        start_date: initial?.start_date
            ? parseISODate(initial.start_date)
            : new Date(),
        end_date: initial?.end_date
            ? parseISODate(initial.end_date)
            : null,
        has_end: Boolean(initial?.end_date),
        is_active: initial?.is_active ?? true,
    }));

    const [startPickerOpen, setStartPickerOpen] = useState(false);
    const [endPickerOpen, setEndPickerOpen] = useState(false);

    const amountNum = parseFloat(form.amount.replace(/[^0-9.]/g, "")) || 0;
    const isValid =
        amountNum > 0 &&
        form.note.trim().length > 0 &&
        form.category_id != null;

    const updateField = <K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) updateField("amount", v);
    };

    const saveMutation = useMutation({
        mutationFn: (payload: {
            amount: number;
            note: string;
            category_id: number;
            frequency: RecurrenceFrequency;
            start_date: string;
            end_date: string | null;
            is_active: boolean;
        }) => {
            if (mode === "edit" && recurringId) {
                return apiClient().put(
                    `/recurring-expenses/${recurringId}`,
                    payload,
                );
            }
            return apiClient().post("/recurring-expenses", payload);
        },
        onSuccess: () => {
            toast.success(
                mode === "create"
                    ? "Recurring expense created"
                    : "Recurring expense updated",
            );
            router.push("/recurring");
            router.refresh();
        },
        onError: (err) => {
            const msg =
                err && typeof err === "object" && "message" in err
                    ? String(
                          (err as { message?: string }).message ??
                              "Request failed",
                      )
                    : "Failed to save";
            toast.error(msg);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || !form.category_id) return;
        if (form.has_end && form.end_date) {
            if (form.end_date < form.start_date) {
                toast.error("End date must be on or after the start date");
                return;
            }
        }
        const payload = {
            amount: amountNum,
            note: form.note.trim(),
            category_id: form.category_id,
            frequency: form.frequency,
            start_date: toISODate(form.start_date),
            end_date:
                form.has_end && form.end_date
                    ? toISODate(form.end_date)
                    : null,
            is_active: form.is_active,
        };
        saveMutation.mutate(payload);
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-8">
                <Link
                    href="/recurring"
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to recurring
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    {mode === "create"
                        ? "Add recurring expense"
                        : "Edit recurring expense"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Schedule a repeating charge so you don&apos;t log it
                    every time
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50"
            >
                <div className="space-y-6 p-6 sm:p-8">
                    <div className="space-y-2">
                        <label
                            htmlFor="re-amount"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">
                                $
                            </span>
                            <input
                                id="re-amount"
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={form.amount}
                                onChange={handleAmountChange}
                                autoFocus
                                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-4 pl-10 pr-4 text-2xl font-semibold text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="re-note"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            id="re-note"
                            type="text"
                            placeholder="e.g. Rent, Netflix, Phone bill"
                            value={form.note}
                            onChange={(e) =>
                                updateField("note", e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="re-frequency"
                            className="text-sm font-semibold text-gray-700"
                        >
                            How often
                        </label>
                        <select
                            id="re-frequency"
                            value={form.frequency}
                            onChange={(e) =>
                                updateField(
                                    "frequency",
                                    e.target.value as RecurrenceFrequency,
                                )
                            }
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        >
                            {RECURRENCE_FREQUENCIES.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">
                            Category
                        </label>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {categories?.map((c) => {
                                const isSelected = form.category_id === c.id;
                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() =>
                                            updateField("category_id", c.id)
                                        }
                                        className={cn(
                                            "flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition-all",
                                            isSelected
                                                ? "border-violet-500 bg-violet-50 text-violet-700"
                                                : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300 hover:bg-gray-100",
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex size-10 items-center justify-center rounded-lg",
                                                isSelected
                                                    ? "bg-violet-100 text-violet-700"
                                                    : "bg-white text-gray-600",
                                            )}
                                        >
                                            <CategoryGlyph
                                                iconId={c.icon}
                                                className="size-5"
                                            />
                                        </div>
                                        <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
                                            {c.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            First occurrence
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    updateField("start_date", new Date())
                                }
                                className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Today
                            </button>
                            <div className="relative flex-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setStartPickerOpen((o) => !o)
                                    }
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm text-gray-900 transition-colors",
                                        startPickerOpen
                                            ? "border-violet-300 bg-white ring-2 ring-violet-500/20"
                                            : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20",
                                    )}
                                >
                                    <CalendarIcon className="size-4 text-gray-400" />
                                    {form.start_date.toLocaleDateString(
                                        "en-US",
                                        {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        },
                                    )}
                                </button>
                                {startPickerOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setStartPickerOpen(false)
                                            }
                                            aria-hidden
                                        />
                                        <div className="absolute left-0 top-full z-40 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                                            <DayPicker
                                                mode="single"
                                                selected={form.start_date}
                                                onSelect={(d) => {
                                                    if (d) {
                                                        updateField(
                                                            "start_date",
                                                            d,
                                                        );
                                                    }
                                                    setStartPickerOpen(false);
                                                }}
                                                defaultMonth={form.start_date}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.has_end}
                                onChange={(e) => {
                                    const on = e.target.checked;
                                    updateField("has_end", on);
                                    if (on && !form.end_date) {
                                        const d = new Date(form.start_date);
                                        d.setFullYear(
                                            d.getFullYear() + 1,
                                        );
                                        updateField("end_date", d);
                                    }
                                }}
                                className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            Set an end date (optional)
                        </label>
                        {form.has_end && (
                            <div className="relative pl-0">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEndPickerOpen((o) => !o)
                                    }
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm text-gray-900 transition-colors",
                                        endPickerOpen
                                            ? "border-violet-300 bg-white ring-2 ring-violet-500/20"
                                            : "border-gray-200 bg-gray-50/50",
                                    )}
                                >
                                    <CalendarIcon className="size-4 text-gray-400" />
                                    {form.end_date
                                        ? form.end_date.toLocaleDateString(
                                              "en-US",
                                              {
                                                  weekday: "short",
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              },
                                          )
                                        : "Pick end date"}
                                </button>
                                {endPickerOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setEndPickerOpen(false)
                                            }
                                            aria-hidden
                                        />
                                        <div className="absolute left-0 top-full z-40 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                                            <DayPicker
                                                mode="single"
                                                selected={form.end_date ?? undefined}
                                                onSelect={(d) => {
                                                    if (d) {
                                                        updateField("end_date", d);
                                                    }
                                                    setEndPickerOpen(false);
                                                }}
                                                defaultMonth={
                                                    form.end_date ??
                                                    form.start_date
                                                }
                                                disabled={(day) => {
                                                    const min = new Date(
                                                        form.start_date,
                                                    );
                                                    return (
                                                        differenceInCalendarDays(
                                                            day,
                                                            min,
                                                        ) < 0
                                                    );
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {mode === "edit" && (
                        <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                            <span>
                                <span className="block text-sm font-semibold text-gray-800">
                                    Active
                                </span>
                                <span className="text-xs text-gray-500">
                                    Paused items won&apos;t create new
                                    entries
                                </span>
                            </span>
                            <input
                                type="checkbox"
                                className="size-5 rounded border-gray-300 text-violet-600"
                                checked={form.is_active}
                                onChange={(e) =>
                                    updateField("is_active", e.target.checked)
                                }
                            />
                        </label>
                    )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/30 px-6 py-5 sm:flex-row sm:justify-end sm:gap-3">
                    <Link
                        href="/recurring"
                        className="inline-flex justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={!isValid || saveMutation.isPending}
                        className={cn(
                            "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all",
                            isValid && !saveMutation.isPending
                                ? "bg-violet-600 shadow-sm hover:bg-violet-700 hover:shadow-md"
                                : "cursor-not-allowed bg-gray-300",
                        )}
                    >
                        {saveMutation.isPending ? (
                            <>
                                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <RepeatIcon className="size-4" />
                                {mode === "create"
                                    ? "Create schedule"
                                    : "Save changes"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
