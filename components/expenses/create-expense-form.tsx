"use client";

import { expenseCategories, type ExpenseCategory } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import {
    ArrowLeftIcon,
    CalendarIcon,
    CarIcon,
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { toast } from "sonner";

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

export default function CreateExpenseForm() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<ExpenseCategory | null>(null);
    const [date, setDate] = useState<Date>(() => new Date());
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const amountNum = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
    const isValid = amountNum > 0 && description.trim() && category;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setAmount(v);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || !category) return;
        setIsSubmitting(true);
        try {
            // TODO: Replace with API call when backend is ready
            await new Promise((r) => setTimeout(r, 600));
            toast.success("Expense added successfully");
            router.push("/expenses/list");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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
                                value={amount}
                                onChange={handleAmountChange}
                                autoFocus
                                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-4 pl-10 pr-4 text-2xl font-semibold text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label
                            htmlFor="description"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Description
                        </label>
                        <input
                            id="description"
                            type="text"
                            placeholder="e.g. Grocery shopping at Whole Foods"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                    </div>

                    {/* Category grid */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">
                            Category
                        </label>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {expenseCategories.map((c) => {
                                const Icon = CATEGORY_ICONS[c.value];
                                const isSelected = category === c.value;
                                return (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setCategory(c.value)}
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
                                            <Icon className="size-5" />
                                        </div>
                                        <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
                                            {c.label}
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
                                onClick={() => setDate(new Date())}
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
                                    {date.toLocaleDateString("en-US", {
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
                                                selected={date}
                                                onSelect={(d) => {
                                                    if (d) setDate(d);
                                                    setDatePickerOpen(false);
                                                }}
                                                defaultMonth={date}
                                                disabled={{ after: new Date() }}
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
                        disabled={!isValid || isSubmitting}
                        className={cn(
                            "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all",
                            isValid && !isSubmitting
                                ? "bg-violet-600 shadow-sm hover:bg-violet-700 hover:shadow-md"
                                : "cursor-not-allowed bg-gray-300",
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <ReceiptIcon className="size-4" />
                                Add expense
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
