"use client";

import { apiClient } from "@/config/api.client";
import { type ExpenseCategory } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { differenceInCalendarDays } from "date-fns";
import {
    ArrowLeftIcon,
    CalendarIcon,
    CarIcon,
    CheckCircleIcon,
    CircleDollarSignIcon,
    FilmIcon,
    GraduationCapIcon,
    HeartPulseIcon,
    PlaneIcon,
    ReceiptIcon,
    ShoppingBagIcon,
    UtensilsCrossedIcon,
    ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

const CATEGORY_ICONS: Record<
    ExpenseCategory,
    React.ComponentType<{ className?: string }>
> = {
    food: UtensilsCrossedIcon,
    transport: CarIcon,
    shopping: ShoppingBagIcon,
    entertainment: FilmIcon,
    bills: ZapIcon,
    healthcare: HeartPulseIcon,
    education: GraduationCapIcon,
    travel: PlaneIcon,
    other: CircleDollarSignIcon,
};

type FormState = {
    amount: string;
    note: string;
    category_id: number | null;
    date: Date;
};

type CategoryType = {
    id: number;
    name: string;
    description: string;
};

export default function CreateExpenseForm({
    categories,
}: {
    categories: CategoryType[];
}) {
    const [form, setForm] = useState<FormState>(() => ({
        amount: "",
        note: "",
        category_id: 2,
        date: new Date(),
    }));
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const amountNum = parseFloat(form.amount.replace(/[^0-9.]/g, "")) || 0;
    const isValid = amountNum > 0 && form.note.trim() && form.category_id;

    const updateField = <K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) updateField("amount", v);
    };

    const {
        mutate: createExpenseMutation,
        isPending,
        reset,
        status,
        isSuccess,
    } = useMutation({
        mutationFn: (expense: {
            amount: number;
            note: string;
            category_id: number;
            date: Date;
        }) => apiClient().post("/expenses", expense),
        onSuccess: (data) => {
            console.log("data created", data);
            // toast.success("Expense added successfully");
            // router.push("/expenses/list");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || !form.category_id) return;

        createExpenseMutation({
            amount: amountNum,
            note: form.note,
            category_id: form.category_id,
            date: form.date,
        });
    };

    return (
        <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/expenses/list"
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to expenses
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Add expense
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Record a new expense to track your spending
                </p>
            </div>

            {/* Form card */}
            <form
                onSubmit={handleSubmit}
                className=" rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50"
            >
                <div className="space-y-6 p-6 sm:p-8">
                    {/* Amount - hero field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="amount"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">
                                $
                            </span>
                            <input
                                id="amount"
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

                    {/* Description */}
                    <div className="space-y-2">
                        <label
                            htmlFor="note"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Note
                        </label>
                        <input
                            id="note"
                            type="text"
                            placeholder="e.g. Grocery shopping at Whole Foods"
                            value={form.note}
                            onChange={(e) =>
                                updateField("note", e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                    </div>

                    {/* Category grid */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">
                            Category
                        </label>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {categories?.map((c) => {
                                // const Icon = CATEGORY_ICONS[c.id];
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
                                                    ? "bg-violet-100"
                                                    : "bg-white",
                                            )}
                                        >
                                            {/* <Icon className="size-5" /> */}
                                        </div>
                                        <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
                                            {c.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Date
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => updateField("date", new Date())}
                                className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Today
                            </button>
                            <div className="relative flex-1">
                                <button
                                    type="button"
                                    onClick={() => setDatePickerOpen((o) => !o)}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm text-gray-900 transition-colors",
                                        datePickerOpen
                                            ? "border-violet-300 bg-white ring-2 ring-violet-500/20"
                                            : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20",
                                    )}
                                >
                                    <CalendarIcon className="size-4 text-gray-400" />
                                    {(
                                        form.date ?? new Date()
                                    ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </button>
                                {datePickerOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setDatePickerOpen(false)
                                            }
                                            aria-hidden
                                        />
                                        <div className="absolute left-0 top-full z-40 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                                            <DayPicker
                                                mode="single"
                                                selected={
                                                    form.date ?? new Date()
                                                }
                                                onSelect={(selectedDate) => {
                                                    if (selectedDate)
                                                        updateField(
                                                            "date",
                                                            selectedDate,
                                                        );
                                                    setDatePickerOpen(false);
                                                }}
                                                defaultMonth={
                                                    form.date ?? new Date()
                                                }
                                                disabled={(day) =>
                                                    differenceInCalendarDays(
                                                        day,
                                                        new Date(),
                                                    ) > 0
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/30 px-6 py-5 sm:flex-row sm:justify-end sm:gap-3">
                    <Link
                        href="/expenses/list"
                        className="inline-flex justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={!isValid || isPending}
                        className={cn(
                            "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all",
                            isValid && !isPending
                                ? "bg-violet-600 shadow-sm hover:bg-violet-700 hover:shadow-md"
                                : "cursor-not-allowed bg-gray-300",
                        )}
                    >
                        {isPending ? (
                            <>
                                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Adding...
                            </>
                        ) : (
                            <>
                                {isSuccess ? (
                                    <CheckCircleIcon className="size-4 text-white" />
                                ) : (
                                    <ReceiptIcon className="size-4" />
                                )}
                                Add expense
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
