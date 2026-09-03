"use client";

import CategoryModal from "@/components/categories/category-modal";
import {
    currentYearMonth,
    type BudgetPeriodType,
    type CategoryBudget,
    type CreateCategoryBudgetInput,
} from "@/lib/budgets";
import { CategoryGlyph } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";

type CategoryOption = {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
};

type AddBudgetDialogProps = {
    open: boolean;
    onClose: () => void;
    categories: CategoryOption[];
    onCategoriesChanged: () => void;
    onSave: (input: CreateCategoryBudgetInput) => Promise<void>;
    editingBudget?: CategoryBudget | null;
    defaultReferenceMonth?: string;
};

type FormState = {
    categoryId: number | null;
    amount: string;
    periodType: BudgetPeriodType;
    referenceMonth: string;
    referenceYear: string;
    startsAt: Date;
    endsAt: Date;
    note: string;
};

const PERIOD_OPTIONS: { value: BudgetPeriodType; label: string }[] = [
    { value: "monthly", label: "Monthly" },
    { value: "weekly", label: "Weekly" },
    { value: "yearly", label: "Yearly" },
    { value: "custom", label: "Custom period" },
];

function toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function buildInitialForm(
    categories: CategoryOption[],
    editingBudget?: CategoryBudget | null,
    defaultReferenceMonth?: string,
): FormState {
    if (editingBudget) {
        return {
            categoryId: editingBudget.category.id,
            amount: String(editingBudget.amount),
            periodType: editingBudget.periodType,
            referenceMonth: editingBudget.startsAt.slice(0, 7),
            referenceYear: editingBudget.startsAt.slice(0, 4),
            startsAt: new Date(`${editingBudget.startsAt}T00:00:00`),
            endsAt: new Date(`${editingBudget.endsAt}T00:00:00`),
            note: editingBudget.note ?? "",
        };
    }

    return {
        categoryId: categories[0]?.id ?? null,
        amount: "",
        periodType: "monthly",
        referenceMonth: defaultReferenceMonth ?? currentYearMonth(),
        referenceYear: String(new Date().getFullYear()),
        startsAt: new Date(),
        endsAt: new Date(),
        note: "",
    };
}

export default function AddBudgetDialog({
    open,
    onClose,
    categories,
    onCategoriesChanged,
    onSave,
    editingBudget = null,
    defaultReferenceMonth,
}: AddBudgetDialogProps) {
    const labelId = useId();
    const [form, setForm] = useState<FormState>(() =>
        buildInitialForm(categories, editingBudget, defaultReferenceMonth),
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(
                buildInitialForm(
                    categories,
                    editingBudget,
                    defaultReferenceMonth,
                ),
            );
            setError(null);
        }
    }, [open, categories, editingBudget, defaultReferenceMonth]);

    const isEditing = editingBudget != null;

    const updateField = <K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ) => setForm((prev) => ({ ...prev, [field]: value }));

    const monthPickerMonth = useMemo(() => {
        const [year, month] = form.referenceMonth.split("-").map(Number);
        if (year == null || month == null) {
            return new Date();
        }
        return new Date(year, month - 1, 1);
    }, [form.referenceMonth]);

    const submit = async () => {
        const amount = Number.parseFloat(form.amount);
        if (!form.categoryId) {
            setError("Select a category.");
            return;
        }
        if (Number.isNaN(amount) || amount <= 0) {
            setError("Enter a valid budget amount.");
            return;
        }
        if (form.periodType === "custom" && form.endsAt < form.startsAt) {
            setError("End date must be on or after start date.");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await onSave({
                categoryId: form.categoryId,
                amount,
                periodType: form.periodType,
                referenceMonth:
                    form.periodType === "monthly"
                        ? form.referenceMonth
                        : undefined,
                referenceYear:
                    form.periodType === "yearly"
                        ? Number.parseInt(form.referenceYear, 10)
                        : undefined,
                startsAt:
                    form.periodType === "weekly" ||
                    form.periodType === "custom"
                        ? toDateInputValue(form.startsAt)
                        : undefined,
                endsAt:
                    form.periodType === "custom"
                        ? toDateInputValue(form.endsAt)
                        : undefined,
                note: form.note.trim() || null,
            });
            onClose();
        } catch {
            setError("Could not save budget.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <CategoryModal
                openModal={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onSavedSuccessfully={() => {
                    onCategoriesChanged();
                }}
            />

            <Dialog open={open} onClose={onClose} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-[1px]" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id={labelId}
                                    className="text-lg font-semibold text-gray-900"
                                >
                                    {isEditing ? "Edit budget" : "Add budget"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Set a spending cap for a category and
                                    period.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                aria-label="Close"
                            >
                                <XIcon className="size-5" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Category
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCategoryModalOpen(true)
                                        }
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
                                    >
                                        <PlusIcon className="size-4" />
                                        Create category
                                    </button>
                                </div>
                                {categories.length === 0 ? (
                                    <p className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                                        Create a category first to add a budget.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                        {categories.map((category) => {
                                            const isSelected =
                                                form.categoryId ===
                                                category.id;
                                            return (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    onClick={() =>
                                                        updateField(
                                                            "categoryId",
                                                            category.id,
                                                        )
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
                                                            iconId={
                                                                category.icon
                                                            }
                                                            className="size-5"
                                                        />
                                                    </div>
                                                    <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
                                                        {category.name}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor={`${labelId}-amount`}
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Budget amount
                                </label>
                                <div className="mt-2 flex rounded-xl border border-gray-200 shadow-sm focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400">
                                    <span className="flex items-center pl-3 text-gray-500">
                                        $
                                    </span>
                                    <input
                                        id={`${labelId}-amount`}
                                        type="number"
                                        min={0.01}
                                        step="0.01"
                                        value={form.amount}
                                        onChange={(e) =>
                                            updateField(
                                                "amount",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border-0 bg-transparent py-3 pr-3 text-gray-900 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor={`${labelId}-period`}
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Budget period
                                </label>
                                <select
                                    id={`${labelId}-period`}
                                    value={form.periodType}
                                    onChange={(e) =>
                                        updateField(
                                            "periodType",
                                            e.target
                                                .value as BudgetPeriodType,
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                                >
                                    {PERIOD_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {form.periodType === "monthly" && (
                                <div className="rounded-xl border border-gray-200 p-4">
                                    <p className="mb-3 text-sm font-medium text-gray-700">
                                        Select month
                                    </p>
                                    <DayPicker
                                        mode="single"
                                        selected={monthPickerMonth}
                                        onSelect={(date) => {
                                            if (!date) {
                                                return;
                                            }
                                            updateField(
                                                "referenceMonth",
                                                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
                                            );
                                        }}
                                        defaultMonth={monthPickerMonth}
                                        captionLayout="dropdown"
                                    />
                                </div>
                            )}

                            {form.periodType === "weekly" && (
                                <div className="rounded-xl border border-gray-200 p-4">
                                    <p className="mb-3 text-sm font-medium text-gray-700">
                                        Week starts on
                                    </p>
                                    <DayPicker
                                        mode="single"
                                        selected={form.startsAt}
                                        onSelect={(date) => {
                                            if (date) {
                                                updateField("startsAt", date);
                                            }
                                        }}
                                        defaultMonth={form.startsAt}
                                    />
                                </div>
                            )}

                            {form.periodType === "yearly" && (
                                <div>
                                    <label
                                        htmlFor={`${labelId}-year`}
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Year
                                    </label>
                                    <input
                                        id={`${labelId}-year`}
                                        type="number"
                                        min={1970}
                                        max={2100}
                                        value={form.referenceYear}
                                        onChange={(e) =>
                                            updateField(
                                                "referenceYear",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                                    />
                                </div>
                            )}

                            {form.periodType === "custom" && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border border-gray-200 p-4">
                                        <p className="mb-3 text-sm font-medium text-gray-700">
                                            Start date
                                        </p>
                                        <DayPicker
                                            mode="single"
                                            selected={form.startsAt}
                                            onSelect={(date) => {
                                                if (date) {
                                                    updateField(
                                                        "startsAt",
                                                        date,
                                                    );
                                                }
                                            }}
                                            defaultMonth={form.startsAt}
                                        />
                                    </div>
                                    <div className="rounded-xl border border-gray-200 p-4">
                                        <p className="mb-3 text-sm font-medium text-gray-700">
                                            End date
                                        </p>
                                        <DayPicker
                                            mode="single"
                                            selected={form.endsAt}
                                            onSelect={(date) => {
                                                if (date) {
                                                    updateField("endsAt", date);
                                                }
                                            }}
                                            defaultMonth={form.endsAt}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor={`${labelId}-note`}
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Note (optional)
                                </label>
                                <textarea
                                    id={`${labelId}-note`}
                                    value={form.note}
                                    onChange={(e) =>
                                        updateField("note", e.target.value)
                                    }
                                    rows={3}
                                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                                    placeholder="What is this budget for?"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                onClick={() => void submit()}
                                disabled={saving || categories.length === 0}
                                className={cn(
                                    "flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:opacity-60",
                                )}
                            >
                                {saving
                                    ? "Saving…"
                                    : isEditing
                                      ? "Save changes"
                                      : "Create budget"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
