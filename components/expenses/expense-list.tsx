"use client";

import {
    Expense,
    expenseCategories,
    formatCurrency,
    formatDate,
    getCategoryColor,
    getCategoryLabel,
    mockExpenses,
} from "@/lib/expenses";
import { cn } from "@/lib/utils";
import {
    ArrowUpDownIcon,
    Grid3X3Icon,
    ListIcon,
    MoreHorizontalIcon,
    PencilIcon,
    PlusIcon,
    ReceiptIcon,
    SearchIcon,
    Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type ViewMode = "list" | "grid";
type SortKey = "date" | "amount" | "category" | "description";
type SortDir = "asc" | "desc";
type DateFilter = "all" | "7d" | "30d" | "90d";

export default function ExpenseList() {
    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get("category");
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // useEffect(() => {
    //     if (
    //         categoryFromUrl &&
    //         expenseCategories.some((c) => c.value === categoryFromUrl)
    //     ) {
    //         setCategoryFilter(categoryFromUrl);
    //     }
    // }, [categoryFromUrl]);
    const [dateFilter, setDateFilter] = useState<DateFilter>("all");
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const filteredAndSorted = useMemo(() => {
        let result = [...mockExpenses];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (e) =>
                    e.description.toLowerCase().includes(q) ||
                    getCategoryLabel(e.category).toLowerCase().includes(q),
            );
        }

        if (categoryFilter !== "all") {
            result = result.filter((e) => e.category === categoryFilter);
        }

        if (dateFilter !== "all") {
            const now = new Date();
            const cutoff = new Date(now);
            cutoff.setHours(0, 0, 0, 0);
            if (dateFilter === "7d") cutoff.setDate(cutoff.getDate() - 7);
            else if (dateFilter === "30d")
                cutoff.setDate(cutoff.getDate() - 30);
            else if (dateFilter === "90d")
                cutoff.setDate(cutoff.getDate() - 90);
            const cutoffTime = cutoff.getTime();
            result = result.filter(
                (e) => new Date(e.date).getTime() >= cutoffTime,
            );
        }

        result.sort((a, b) => {
            let cmp = 0;
            switch (sortKey) {
                case "date":
                    cmp =
                        new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case "amount":
                    cmp = a.amount - b.amount;
                    break;
                case "category":
                    cmp = getCategoryLabel(a.category).localeCompare(
                        getCategoryLabel(b.category),
                    );
                    break;
                case "description":
                    cmp = a.description.localeCompare(b.description);
                    break;
                default:
                    cmp = 0;
            }
            return sortDir === "asc" ? cmp : -cmp;
        });

        return result;
    }, [search, categoryFilter, dateFilter, sortKey, sortDir]);

    const totalAmount = filteredAndSorted.reduce((s, e) => s + e.amount, 0);
    const selectedAmount = filteredAndSorted
        .filter((e) => selectedIds.has(e.id))
        .reduce((s, e) => s + e.amount, 0);

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredAndSorted.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredAndSorted.map((e) => e.id)));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Expenses
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500">
                        {filteredAndSorted.length} expense
                        {filteredAndSorted.length !== 1 ? "s" : ""} ·{" "}
                        {formatCurrency(totalAmount)} total
                    </p>
                </div>
                <Link
                    href="/expenses/new"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                    <PlusIcon className="size-4" />
                    Add expense
                </Link>
            </div>

            {/* Bulk actions */}
            {selectedIds.size > 0 && (
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-violet-200 bg-violet-50/50 px-5 py-3">
                    <span className="text-sm font-medium text-violet-800">
                        {selectedIds.size} selected ·{" "}
                        {formatCurrency(selectedAmount)}
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        >
                            Export
                        </button>
                        <button
                            type="button"
                            className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedIds(new Set())}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100"
                        >
                            Clear selection
                        </button>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm shadow-gray-200/50 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs">
                    <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search expenses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Date filter */}
                    <select
                        value={dateFilter}
                        onChange={(e) =>
                            setDateFilter(e.target.value as DateFilter)
                        }
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    >
                        <option value="all">All time</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>

                    {/* Category filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    >
                        <option value="all">All categories</option>
                        {expenseCategories.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>

                    {/* Sort */}
                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
                        <ArrowUpDownIcon className="ml-2 size-4 text-gray-400" />
                        <select
                            value={`${sortKey}-${sortDir}`}
                            onChange={(e) => {
                                const [k, d] = e.target.value.split("-") as [
                                    SortKey,
                                    SortDir,
                                ];
                                setSortKey(k);
                                setSortDir(d);
                            }}
                            className="border-0 bg-transparent py-1.5 pr-6 pl-1 text-sm font-medium text-gray-700 focus:outline-none focus:ring-0"
                        >
                            <option value="date-desc">Newest first</option>
                            <option value="date-asc">Oldest first</option>
                            <option value="amount-desc">
                                Amount: High to low
                            </option>
                            <option value="amount-asc">
                                Amount: Low to high
                            </option>
                            <option value="category-asc">Category: A–Z</option>
                            <option value="description-asc">Name: A–Z</option>
                        </select>
                    </div>

                    {/* View toggle */}
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
            {filteredAndSorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/30 py-20">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-gray-100">
                        <ReceiptIcon className="size-8 text-gray-400" />
                    </div>
                    <p className="mt-4 text-base font-medium text-gray-600">
                        No expenses found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {search || categoryFilter !== "all"
                            ? "Try adjusting your filters"
                            : "Add your first expense to get started"}
                    </p>
                    {!search && categoryFilter === "all" && (
                        <Link
                            href="/expenses/new"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                        >
                            <PlusIcon className="size-4" />
                            Add expense
                        </Link>
                    )}
                </div>
            ) : viewMode === "list" ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="w-12 px-6 py-3.5">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedIds.size ===
                                                    filteredAndSorted.length &&
                                                filteredAndSorted.length > 0
                                            }
                                            onChange={toggleSelectAll}
                                            className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                            aria-label="Select all"
                                        />
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Description
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Category
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Date
                                    </th>
                                    <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Amount
                                    </th>
                                    <th className="w-12 px-6 py-3.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAndSorted.map((expense) => (
                                    <ExpenseListRow
                                        key={expense.id}
                                        expense={expense}
                                        selected={selectedIds.has(expense.id)}
                                        onToggleSelect={toggleSelect}
                                        menuOpen={openMenuId === expense.id}
                                        onMenuToggle={() =>
                                            setOpenMenuId(
                                                openMenuId === expense.id
                                                    ? null
                                                    : expense.id,
                                            )
                                        }
                                        onMenuClose={() => setOpenMenuId(null)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredAndSorted.map((expense) => (
                        <ExpenseGridCard
                            key={expense.id}
                            expense={expense}
                            selected={selectedIds.has(expense.id)}
                            onToggleSelect={toggleSelect}
                            menuOpen={openMenuId === expense.id}
                            onMenuToggle={() =>
                                setOpenMenuId(
                                    openMenuId === expense.id
                                        ? null
                                        : expense.id,
                                )
                            }
                            onMenuClose={() => setOpenMenuId(null)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ExpenseListRow({
    expense,
    selected,
    onToggleSelect,
    menuOpen,
    onMenuToggle,
    onMenuClose,
}: {
    expense: Expense;
    selected: boolean;
    onToggleSelect: (id: string) => void;
    menuOpen: boolean;
    onMenuToggle: () => void;
    onMenuClose: () => void;
}) {
    return (
        <tr className="group relative transition-colors hover:bg-gray-50/80">
            <td className="px-6 py-4">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect(expense.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    aria-label={`Select ${expense.description}`}
                />
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600">
                        <ReceiptIcon className="size-5" />
                    </div>
                    <span className="font-medium text-gray-900">
                        {expense.description || "—"}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span
                    className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                        getCategoryColor(expense.category),
                    )}
                >
                    {getCategoryLabel(expense.category)}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(expense.date)}
            </td>
            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
            </td>
            <td className="px-6 py-4">
                <div className="relative">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMenuToggle();
                        }}
                        className="rounded-lg p-2 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100"
                        aria-label="More options"
                    >
                        <MoreHorizontalIcon className="size-4" />
                    </button>
                    {menuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={onMenuClose}
                                aria-hidden
                            />
                            <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                                <Link
                                    href={`/expenses/${expense.id}`}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={onMenuClose}
                                >
                                    <PencilIcon className="size-4" />
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                    onClick={onMenuClose}
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
    );
}

function ExpenseGridCard({
    expense,
    selected,
    onToggleSelect,
    menuOpen,
    onMenuToggle,
    onMenuClose,
}: {
    expense: Expense;
    selected: boolean;
    onToggleSelect: (id: string) => void;
    menuOpen: boolean;
    onMenuToggle: () => void;
    onMenuClose: () => void;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50 transition-all hover:border-gray-200 hover:shadow-md">
            {/* Top bar: checkbox + icon + menu */}
            <div className="flex items-start justify-between p-5 pb-4">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onToggleSelect(expense.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="size-4 shrink-0 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        aria-label={`Select ${expense.description}`}
                    />
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600">
                        <ReceiptIcon className="size-5" />
                    </div>
                </div>
                <div className="relative">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMenuToggle();
                        }}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        aria-label="More options"
                    >
                        <MoreHorizontalIcon className="size-4" />
                    </button>
                    {menuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={onMenuClose}
                                aria-hidden
                            />
                            <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                                <Link
                                    href={`/expenses/${expense.id}`}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={onMenuClose}
                                >
                                    <PencilIcon className="size-4" />
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                    onClick={onMenuClose}
                                >
                                    <Trash2Icon className="size-4" />
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Content */}
            <div className="px-5 pb-4">
                <p className="line-clamp-2 font-medium text-gray-900">
                    {expense.description || "—"}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                        className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                            getCategoryColor(expense.category),
                        )}
                    >
                        {getCategoryLabel(expense.category)}
                    </span>
                    <span className="text-xs text-gray-400">
                        {formatDate(expense.date)}
                    </span>
                </div>
            </div>
            {/* Amount footer */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                <p className="text-lg font-bold tracking-tight text-gray-900">
                    {formatCurrency(expense.amount)}
                </p>
            </div>
        </div>
    );
}
