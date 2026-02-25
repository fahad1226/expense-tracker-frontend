"use client";

import type { ExpenseCategory } from "@/lib/expenses";
import { formatCurrency } from "@/lib/expenses";
import { cn } from "@/lib/utils";
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
    TvIcon,
    UtensilsCrossedIcon,
    ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CategoryModal from "./category-modal";

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

interface CategoryStats {
    id: number;
    name: string;
    description: string;
    expenses_count: number;
    expenses_sum_amount: number;
}

export default function CategoryList({
    categories,
}: {
    categories: CategoryStats[];
}) {
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("amount");
    const [openModal, setOpenModal] = useState(false);

    function handleSavedSuccessfully() {
        setOpenModal(false);
    }

    return (
        <div className="space-y-6">
            {/* Header */}

            <CategoryModal
                openModal={openModal}
                onClose={() => setOpenModal(false)}
                onSavedSuccessfully={handleSavedSuccessfully}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Categories
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500">
                        {categories.length} categor
                        {categories.length !== 1 ? "ies" : "y"} ·{" "}
                        {categories.reduce(
                            (s: number, c: CategoryStats) =>
                                s + c.expenses_count,
                            0,
                        )}{" "}
                        expense
                        {categories.reduce(
                            (s: number, c: CategoryStats) =>
                                s + c.expenses_count,
                            0,
                        ) !== 1
                            ? "s"
                            : ""}{" "}
                        ·{" "}
                        {formatCurrency(
                            categories.reduce(
                                (s: number, c: CategoryStats) =>
                                    s + c.expenses_sum_amount,
                                0,
                            ),
                        )}{" "}
                        total
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setOpenModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                    <PlusIcon className="size-4" />
                    Add Category
                </button>
            </div>

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
            {categories.length === 0 ? (
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
                                        Description
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
                                {categories.map(
                                    (cat: CategoryStats, indx: number) => (
                                        <CategoryListRow
                                            key={indx}
                                            category={cat}
                                        />
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categories.map((cat: CategoryStats, indx: number) => (
                        <CategoryGridCard key={indx} category={cat} />
                    ))}
                </div>
            )}
        </div>
    );
}

function CategoryListRow({ category }: { category: CategoryStats }) {
    return (
        <tr className="group transition-colors hover:bg-gray-50/80">
            <td className="px-6 py-4">
                <Link
                    href={`/expenses/list?category=${category.id}`}
                    className="flex items-center gap-3"
                >
                    <div className="flex size-11 items-center justify-center rounded-xl">
                        <TvIcon className="size-5" />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-violet-600">
                        {category.name}
                    </span>
                </Link>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                    {category.description}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                    {category.expenses_count} expense
                    {category.expenses_count !== 1 ? "s" : ""}
                </span>
            </td>
            <td className="px-6 py-4">
                <p className="flex items-center justify-end gap-1">
                    <span className="font-semibold text-gray-900">
                        {formatCurrency(category.expenses_sum_amount)}
                    </span>
                    <ChevronRightIcon className="size-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
            </td>
        </tr>
    );
}

function CategoryGridCard({ category }: { category: CategoryStats }) {
    return (
        <Link
            href={`/expenses/list?category=${category.id}`}
            className="group block overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50 transition-all hover:border-gray-200 hover:shadow-md"
        >
            <div className="flex items-start justify-between p-5">
                <div className="flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
                    <TvIcon className="size-6" />
                </div>
                <ChevronRightIcon className="size-4 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="px-5 pb-4">
                <p className="font-semibold text-gray-900">{category.name}</p>
                <p className="text-sm text-gray-600">{category.description}</p>
                <p className="mt-1 text-sm text-gray-500">
                    {category.expenses_count} expense
                    {category.expenses_count !== 1 ? "s" : ""}
                </p>
            </div>
            <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                <p className="text-lg font-bold tracking-tight text-gray-900">
                    {formatCurrency(category.expenses_sum_amount)}
                </p>
            </div>
        </Link>
    );
}
