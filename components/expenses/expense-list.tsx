"use client";

import { apiClient } from "@/config/api.client";
import { CategoryGlyph } from "@/lib/category-icons";
import {
    Expense,
    expenseCategories,
    formatCurrency,
    formatDate,
    getCategoryColor,
    getCategoryLabel,
    type PaginatedExpensesResponse,
} from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
    ArrowUpDownIcon,
    CheckIcon,
    Grid3X3Icon,
    ListIcon,
    Loader2Icon,
    MinusIcon,
    MoreHorizontalIcon,
    PencilIcon,
    PlusIcon,
    ReceiptIcon,
    SearchIcon,
    Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

const EXPENSES_PER_PAGE = 15;

type ViewMode = "list" | "grid";
type SortKey = "date" | "amount" | "category" | "description";
type SortDir = "asc" | "desc";
type DateFilter = "all" | "7d" | "30d" | "90d";

function ExpenseRowCheckbox({
    checked,
    onCheckedChange,
    ariaLabel,
}: {
    checked: boolean;
    onCheckedChange: () => void;
    ariaLabel: string;
}) {
    return (
        <label className="inline-flex cursor-pointer select-none items-center justify-center p-0.5">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onCheckedChange()}
                className="peer sr-only"
                aria-label={ariaLabel}
            />
            <span
                className={cn(
                    "flex size-[1.125rem] items-center justify-center rounded-md border-2 shadow-sm transition-all duration-150",
                    "border-gray-200/90 bg-white",
                    "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500/35 peer-focus-visible:ring-offset-2",
                    checked
                        ? "border-transparent bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-md shadow-violet-500/20"
                        : "peer-hover:border-violet-300/80 peer-hover:shadow-md peer-hover:shadow-gray-200/40",
                )}
            >
                <CheckIcon
                    strokeWidth={3}
                    className={cn(
                        "size-3 transition-all duration-150",
                        checked
                            ? "scale-100 opacity-100"
                            : "scale-75 opacity-0",
                    )}
                />
            </span>
        </label>
    );
}

function ExpenseSelectAllCheckbox({
    allSelected,
    someSelected,
    onToggle,
    disabled,
}: {
    allSelected: boolean;
    someSelected: boolean;
    onToggle: () => void;
    disabled?: boolean;
}) {
    const indeterminate = someSelected && !allSelected;

    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={indeterminate ? "mixed" : allSelected}
            disabled={disabled}
            onClick={onToggle}
            className={cn(
                "flex size-[1.125rem] shrink-0 items-center justify-center rounded-md border-2 shadow-sm transition-all duration-150",
                "disabled:cursor-not-allowed disabled:opacity-40",
                allSelected || indeterminate
                    ? "border-transparent bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-md shadow-violet-500/20"
                    : "border-gray-200/90 bg-white hover:border-violet-300/80 hover:shadow-md hover:shadow-gray-200/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 focus-visible:ring-offset-2",
            )}
        >
            {indeterminate ? (
                <MinusIcon strokeWidth={3} className="size-3" />
            ) : allSelected ? (
                <CheckIcon strokeWidth={3} className="size-3" />
            ) : null}
        </button>
    );
}

type ExpenseListProps = {
    initialPage: PaginatedExpensesResponse;
};

export default function ExpenseList({ initialPage }: ExpenseListProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<DateFilter>("all");
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        refetch,
        isFetching,
    } = useInfiniteQuery({
        queryKey: ["expenses", "infinite", EXPENSES_PER_PAGE],
        queryFn: async ({ pageParam }) => {
            const res = await apiClient().get<PaginatedExpensesResponse>(
                "/expenses",
                { params: { page: pageParam, per_page: EXPENSES_PER_PAGE } },
            );
            return res.data;
        },
        initialPageParam: 1,
        initialData: {
            pages: [initialPage],
            pageParams: [1],
        },
        getNextPageParam: (lastPage) => {
            const meta = lastPage?.meta;
            if (
                meta == null ||
                meta.current_page == null ||
                meta.last_page == null
            ) {
                return undefined;
            }
            return meta.current_page < meta.last_page
                ? meta.current_page + 1
                : undefined;
        },
    });

    const loadedExpenses = useMemo(
        () => data?.pages?.flatMap((p) => p?.data ?? []) ?? [],
        [data],
    );

    const totalCount = useMemo(() => {
        const pages = data?.pages ?? [];
        const last = pages.length > 0 ? pages[pages.length - 1] : undefined;
        return last?.meta?.total ?? loadedExpenses.length;
    }, [data?.pages, loadedExpenses.length]);

    const filteredAndSorted = useMemo(() => {
        let list = [...loadedExpenses];

        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (e) =>
                    (e.description || "").toLowerCase().includes(q) ||
                    String(e.category).toLowerCase().includes(q),
            );
        }

        if (categoryFilter !== "all") {
            list = list.filter((e) => {
                const normalized = String(e.category).toLowerCase().trim();
                return normalized === categoryFilter;
            });
        }

        const now = new Date();
        if (dateFilter !== "all") {
            const days =
                dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : 90;
            const cutoff = new Date(now);
            cutoff.setDate(cutoff.getDate() - days);
            list = list.filter((e) => new Date(e.date) >= cutoff);
        }

        list.sort((a, b) => {
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
                    cmp = String(a.category).localeCompare(String(b.category));
                    break;
                case "description":
                    cmp = (a.description || "").localeCompare(
                        b.description || "",
                    );
                    break;
                default:
                    break;
            }
            return sortDir === "asc" ? cmp : -cmp;
        });

        return list;
    }, [loadedExpenses, search, categoryFilter, dateFilter, sortKey, sortDir]);

    const toggleSelect = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const allVisibleSelected =
        filteredAndSorted.length > 0 &&
        filteredAndSorted.every((e) => selectedIds.has(e.id));
    const someVisibleSelected = filteredAndSorted.some((e) =>
        selectedIds.has(e.id),
    );

    const toggleSelectAllVisible = () => {
        if (allVisibleSelected) {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                filteredAndSorted.forEach((e) => next.delete(e.id));
                return next;
            });
        } else {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                filteredAndSorted.forEach((e) => next.add(e.id));
                return next;
            });
        }
    };

    const filterActive =
        Boolean(search.trim()) ||
        categoryFilter !== "all" ||
        dateFilter !== "all";

    const subtitle = isError
        ? "Could not load expenses."
        : filterActive
          ? `${filteredAndSorted.length} match your filters · ${loadedExpenses.length} loaded of ${totalCount} total`
          : `${loadedExpenses.length} of ${totalCount} expense${totalCount !== 1 ? "s" : ""} loaded`;

    const showEmpty = !isError && filteredAndSorted.length === 0;
    const isInitialLoading = isFetching && !data;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Expenses
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
                </div>
                <Link
                    href="/expenses/new"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                    <PlusIcon className="size-4" />
                    Add expense
                </Link>
            </div>

            {isError && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 px-5 py-4 text-sm text-red-800">
                    <p className="font-medium">Something went wrong</p>
                    <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-2 font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-800"
                    >
                        Try again
                    </button>
                </div>
            )}

            {selectedIds.size > 0 && (
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-violet-200/80 bg-gradient-to-r from-violet-50/90 to-indigo-50/50 px-5 py-3.5 shadow-sm shadow-violet-500/5">
                    <span className="text-sm font-medium text-violet-900">
                        {selectedIds.size} selected
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="rounded-lg border border-gray-200/80 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        >
                            Export
                        </button>
                        <button
                            type="button"
                            className="rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-700 ring-1 ring-red-200/60 transition-colors hover:bg-red-500/15"
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedIds(new Set())}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-violet-800 hover:bg-violet-100/80"
                        >
                            Clear selection
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm shadow-gray-200/50 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                    <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search expenses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-gray-200/90 bg-gray-50/50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={dateFilter}
                        onChange={(e) =>
                            setDateFilter(e.target.value as DateFilter)
                        }
                        className="rounded-xl border border-gray-200/90 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    >
                        <option value="all">All time</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rounded-xl border border-gray-200/90 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    >
                        <option value="all">All categories</option>
                        {expenseCategories.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-1 rounded-xl border border-gray-200/90 bg-white p-1">
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

                    <div className="flex rounded-xl border border-gray-200/90 bg-gray-50/50 p-0.5">
                        <button
                            type="button"
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "rounded-lg p-2 transition-colors",
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
                                "rounded-lg p-2 transition-colors",
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

            {isInitialLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2Icon className="size-8 animate-spin text-violet-500" />
                </div>
            ) : showEmpty ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200/90 bg-gradient-to-b from-gray-50/40 to-white py-20">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-50 shadow-inner">
                        <ReceiptIcon className="size-8 text-violet-400" />
                    </div>
                    <p className="mt-4 text-base font-medium text-gray-700">
                        No expenses match
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {search ||
                        categoryFilter !== "all" ||
                        dateFilter !== "all"
                            ? "Try adjusting filters or use “Load more” for older items"
                            : totalCount === 0
                              ? "Add your first expense to get started"
                              : "Try adjusting filters"}
                    </p>
                    {!search &&
                        categoryFilter === "all" &&
                        dateFilter === "all" &&
                        totalCount === 0 && (
                            <Link
                                href="/expenses/new"
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 hover:bg-violet-700"
                            >
                                <PlusIcon className="size-4" />
                                Add expense
                            </Link>
                        )}
                </div>
            ) : viewMode === "list" ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-violet-500/[0.03] ring-1 ring-gray-100/80">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gradient-to-b from-gray-50/90 to-gray-50/40">
                                    <th className="w-14 px-5 py-4 pl-6">
                                        <ExpenseSelectAllCheckbox
                                            allSelected={allVisibleSelected}
                                            someSelected={someVisibleSelected}
                                            onToggle={toggleSelectAllVisible}
                                            disabled={
                                                filteredAndSorted.length === 0
                                            }
                                        />
                                    </th>
                                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Description
                                    </th>
                                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Category
                                    </th>
                                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Date
                                    </th>
                                    <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        Amount
                                    </th>
                                    <th className="w-12 px-5 py-4 pr-6" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/90">
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

            {!showEmpty && !isInitialLoading && hasNextPage && (
                <div className="flex justify-center py-6">
                    <button
                        type="button"
                        onClick={() => void fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className={cn(
                            "inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-xl border border-violet-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition-all",
                            "hover:border-violet-300 hover:bg-violet-50/80 hover:shadow-md",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 focus-visible:ring-offset-2",
                        )}
                    >
                        {isFetchingNextPage ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                Loading…
                            </>
                        ) : (
                            "Load more"
                        )}
                    </button>
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
        <tr className="group relative transition-colors hover:bg-violet-50/30">
            <td className="px-5 py-4 pl-6 align-middle">
                <ExpenseRowCheckbox
                    checked={selected}
                    onCheckedChange={() => onToggleSelect(expense.id)}
                    ariaLabel={`Select ${expense.description || "expense"}`}
                />
            </td>

            <td className="px-5 py-4 align-middle">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 shadow-sm ring-1 ring-gray-100/80 transition-colors group-hover:from-violet-50 group-hover:to-violet-100/50 group-hover:text-violet-600">
                        <CategoryGlyph
                            iconId={expense.category_icon}
                            className="size-5"
                        />
                    </div>
                    <span className="font-medium text-gray-900">
                        {expense.description || "—"}
                    </span>
                </div>
            </td>
            <td className="px-5 py-4 align-middle">
                <span
                    className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-black/[0.03]",
                        getCategoryColor(expense.category),
                    )}
                >
                    <CategoryGlyph
                        iconId={expense.category_icon}
                        className="size-3.5 shrink-0 opacity-90"
                    />
                    {getCategoryLabel(expense.category)}
                </span>
            </td>
            <td className="px-5 py-4 text-sm text-gray-500 align-middle">
                {formatDate(expense.date)}
            </td>
            <td className="px-5 py-4 text-right font-semibold tabular-nums text-gray-900 align-middle">
                {formatCurrency(expense.amount)}
            </td>
            <td className="px-5 py-4 pr-6 align-middle">
                <div className="relative flex justify-end">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMenuToggle();
                        }}
                        className="rounded-lg p-2 text-gray-400 opacity-0 transition-opacity hover:bg-white hover:text-violet-600 hover:shadow-sm group-hover:opacity-100"
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
                            <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200/90 bg-white py-1 shadow-lg shadow-gray-200/50">
                                <Link
                                    href={`/expenses/${expense.id}`}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50/60"
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
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-violet-500/[0.03] ring-1 ring-gray-100/60 transition-all hover:border-violet-200/60 hover:shadow-md">
            <div className="flex items-start justify-between p-5 pb-4">
                <div className="flex items-center gap-3">
                    <ExpenseRowCheckbox
                        checked={selected}
                        onCheckedChange={() => onToggleSelect(expense.id)}
                        ariaLabel={`Select ${expense.description || "expense"}`}
                    />
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 shadow-sm ring-1 ring-gray-100/80 transition-colors group-hover:from-violet-50 group-hover:to-violet-100/50 group-hover:text-violet-600">
                        <CategoryGlyph
                            iconId={expense.category_icon}
                            className="size-5"
                        />
                    </div>
                </div>
                <div className="relative">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMenuToggle();
                        }}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
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
                            <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200/90 bg-white py-1 shadow-lg">
                                <Link
                                    href={`/expenses/${expense.id}`}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50/60"
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
            <div className="px-5 pb-4">
                <p className="line-clamp-2 font-medium text-gray-900">
                    {expense.description || "—"}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-black/[0.03]",
                            getCategoryColor(expense.category),
                        )}
                    >
                        <CategoryGlyph
                            iconId={expense.category_icon}
                            className="size-3.5 shrink-0 opacity-90"
                        />
                        {getCategoryLabel(expense.category)}
                    </span>
                    <span className="text-xs text-gray-400">
                        {formatDate(expense.date)}
                    </span>
                </div>
            </div>
            <div className="border-t border-gray-100/90 bg-gradient-to-r from-gray-50/50 to-white px-5 py-3">
                <p className="text-lg font-bold tabular-nums tracking-tight text-gray-900">
                    {formatCurrency(expense.amount)}
                </p>
            </div>
        </div>
    );
}
