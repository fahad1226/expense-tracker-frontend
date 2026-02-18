"use client";

import type { ExpenseCategory } from "@/lib/expenses";
import {
    expenseCategories,
    formatCurrency,
    getCategoryColor,
    mockExpenses,
} from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
    ArrowUpDownIcon,
    CarIcon,
    ChevronRightIcon,
    CircleDollarSignIcon,
    FilmIcon,
    GraduationCapIcon,
    Grid3X3Icon,
    HeartPulseIcon,
    ListIcon,
    PlaneIcon,
    PlusIcon,
    SearchIcon,
    ShoppingBagIcon,
    TagIcon,
    UtensilsCrossedIcon,
    XIcon,
    ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ViewMode = "list" | "grid";
type SortKey = "name" | "count" | "amount";

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

const ICON_OPTIONS: {
    id: string;
    Icon: React.ComponentType<{ className?: string }>;
}[] = [
    { id: "utensils", Icon: UtensilsCrossedIcon },
    { id: "car", Icon: CarIcon },
    { id: "shopping", Icon: ShoppingBagIcon },
    { id: "film", Icon: FilmIcon },
    { id: "zap", Icon: ZapIcon },
    { id: "heart", Icon: HeartPulseIcon },
    { id: "graduation", Icon: GraduationCapIcon },
    { id: "plane", Icon: PlaneIcon },
    { id: "dollar", Icon: CircleDollarSignIcon },
    { id: "tag", Icon: TagIcon },
];

interface CategoryStats {
    value: ExpenseCategory;
    label: string;
    expenseCount: number;
    totalAmount: number;
}

function getCategoryStats(): CategoryStats[] {
    const totals: Record<ExpenseCategory, { count: number; amount: number }> =
        {} as Record<ExpenseCategory, { count: number; amount: number }>;

    for (const c of expenseCategories) {
        totals[c.value] = { count: 0, amount: 0 };
    }

    for (const e of mockExpenses) {
        totals[e.category].count += 1;
        totals[e.category].amount += e.amount;
    }

    return expenseCategories.map((c) => ({
        value: c.value,
        label: c.label,
        expenseCount: totals[c.value].count,
        totalAmount: totals[c.value].amount,
    }));
}

export default function CategoryList() {
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("amount");
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addName, setAddName] = useState("");
    const [addDescription, setAddDescription] = useState("");
    const [addIconId, setAddIconId] = useState(ICON_OPTIONS[0].id);

    const categories = useMemo(() => getCategoryStats(), []);
    const filtered = useMemo(() => {
        const result = search.trim()
            ? categories.filter((c) =>
                  c.label.toLowerCase().includes(search.toLowerCase()),
              )
            : [...categories];

        result.sort((a, b) => {
            if (sortKey === "name") return a.label.localeCompare(b.label);
            if (sortKey === "count") return b.expenseCount - a.expenseCount;
            return b.totalAmount - a.totalAmount;
        });
        return result;
    }, [categories, search, sortKey]);

    const totalExpenses = filtered.reduce((s, c) => s + c.expenseCount, 0);
    const totalAmount = filtered.reduce((s, c) => s + c.totalAmount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Categories
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500">
                        {filtered.length} categor
                        {filtered.length !== 1 ? "ies" : "y"} · {totalExpenses}{" "}
                        expense
                        {totalExpenses !== 1 ? "s" : ""} ·{" "}
                        {formatCurrency(totalAmount)} total
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setAddModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                    <PlusIcon className="size-4" />
                    Add Category
                </button>
            </div>

            {/* Add Category Modal */}
            <Dialog
                open={addModalOpen}
                onClose={() => {
                    setAddModalOpen(false);
                    setAddName("");
                    setAddDescription("");
                    setAddIconId(ICON_OPTIONS[0].id);
                }}
                className="relative z-50"
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 transition-opacity duration-200 data-closed:opacity-0"
                />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl transition duration-200 data-closed:scale-95 data-closed:opacity-0"
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Add category
                            </h2>
                            <button
                                type="button"
                                onClick={() => setAddModalOpen(false)}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                aria-label="Close"
                            >
                                <XIcon className="size-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // TODO: API call to create category when backend is ready
                                toast.success("Category added successfully");
                                setAddModalOpen(false);
                                setAddName("");
                                setAddDescription("");
                                setAddIconId(ICON_OPTIONS[0].id);
                            }}
                            className="space-y-5 p-6"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="category-name"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    id="category-name"
                                    type="text"
                                    placeholder="e.g. Groceries"
                                    value={addName}
                                    onChange={(e) => setAddName(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="category-description"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="category-description"
                                    placeholder="Optional description for this category"
                                    value={addDescription}
                                    onChange={(e) =>
                                        setAddDescription(e.target.value)
                                    }
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">
                                    Icon
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {ICON_OPTIONS.map(({ id, Icon }) => {
                                        const isSelected = addIconId === id;
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setAddIconId(id)}
                                                className={cn(
                                                    "flex size-12 items-center justify-center rounded-xl border-2 transition-all",
                                                    isSelected
                                                        ? "border-violet-500 bg-violet-50 text-violet-600"
                                                        : "border-gray-200 bg-gray-50/50 text-gray-500 hover:border-gray-300 hover:bg-gray-100",
                                                )}
                                            >
                                                <Icon className="size-5" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex gap-3 border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={() => setAddModalOpen(false)}
                                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!addName.trim()}
                                    className={cn(
                                        "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all",
                                        addName.trim()
                                            ? "bg-violet-600 hover:bg-violet-700"
                                            : "cursor-not-allowed bg-gray-300",
                                    )}
                                >
                                    Add category
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm shadow-gray-200/50 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                    <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5">
                        <ArrowUpDownIcon className="size-4 text-gray-400" />
                        <select
                            value={sortKey}
                            onChange={(e) =>
                                setSortKey(e.target.value as SortKey)
                            }
                            className="border-0 bg-transparent py-0.5 pr-4 pl-1 text-sm font-medium text-gray-700 focus:outline-none focus:ring-0"
                        >
                            <option value="amount">Total spent</option>
                            <option value="count">Expense count</option>
                            <option value="name">Name A–Z</option>
                        </select>
                    </div>
                    <div className="flex rounded-lg border border-gray-200 bg-gray-50/50 p-0.5">
                        <button
                            type="button"
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "rounded-md p-2 transition-colors",
                                viewMode === "list"
                                    ? "bg-white text-violet-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700",
                            )}
                            aria-label="List view"
                        >
                            <ListIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "rounded-md p-2 transition-colors",
                                viewMode === "grid"
                                    ? "bg-white text-violet-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700",
                            )}
                            aria-label="Grid view"
                        >
                            <Grid3X3Icon className="size-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/30 py-20">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-gray-100">
                        <TagIcon className="size-8 text-gray-400" />
                    </div>
                    <p className="mt-4 text-base font-medium text-gray-600">
                        No categories found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {search
                            ? "Try adjusting your search"
                            : "Categories will appear when you add expenses"}
                    </p>
                </div>
            ) : viewMode === "list" ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Category
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Expenses
                                    </th>
                                    <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Total spent
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((cat) => (
                                    <CategoryListRow
                                        key={cat.value}
                                        category={cat}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((cat) => (
                        <CategoryGridCard key={cat.value} category={cat} />
                    ))}
                </div>
            )}
        </div>
    );
}

function CategoryListRow({ category }: { category: CategoryStats }) {
    const Icon = CATEGORY_ICONS[category.value];
    return (
        <tr className="group transition-colors hover:bg-gray-50/80">
            <td className="px-6 py-4">
                <Link
                    href={`/expenses/list?category=${category.value}`}
                    className="flex items-center gap-3"
                >
                    <div
                        className={cn(
                            "flex size-11 items-center justify-center rounded-xl",
                            getCategoryColor(category.value),
                        )}
                    >
                        <Icon className="size-5" />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-violet-600">
                        {category.label}
                    </span>
                </Link>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                    {category.expenseCount} expense
                    {category.expenseCount !== 1 ? "s" : ""}
                </span>
            </td>
            <td className="px-6 py-4">
                <Link
                    href={`/expenses/list?category=${category.value}`}
                    className="flex items-center justify-end gap-1"
                >
                    <span className="font-semibold text-gray-900">
                        {formatCurrency(category.totalAmount)}
                    </span>
                    <ChevronRightIcon className="size-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
            </td>
        </tr>
    );
}

function CategoryGridCard({ category }: { category: CategoryStats }) {
    const Icon = CATEGORY_ICONS[category.value];
    return (
        <Link
            href={`/expenses/list?category=${category.value}`}
            className="group block overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50 transition-all hover:border-gray-200 hover:shadow-md"
        >
            <div className="flex items-start justify-between p-5">
                <div
                    className={cn(
                        "flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                        getCategoryColor(category.value),
                    )}
                >
                    <Icon className="size-6" />
                </div>
                <ChevronRightIcon className="size-4 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="px-5 pb-4">
                <p className="font-semibold text-gray-900">{category.label}</p>
                <p className="mt-1 text-sm text-gray-500">
                    {category.expenseCount} expense
                    {category.expenseCount !== 1 ? "s" : ""}
                </p>
            </div>
            <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                <p className="text-lg font-bold tracking-tight text-gray-900">
                    {formatCurrency(category.totalAmount)}
                </p>
            </div>
        </Link>
    );
}
