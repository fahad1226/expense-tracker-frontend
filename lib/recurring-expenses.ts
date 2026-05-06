import type { ExpenseCategory } from "./expenses";

/**
 * Recurring expenses API (Laravel) — expected contract:
 * - GET    /recurring-expenses
 * - POST   /recurring-expenses
 * - GET    /recurring-expenses/{id}
 * - PUT    /recurring-expenses/{id}
 * - DELETE /recurring-expenses/{id}
 *
 * JSON body (POST/PUT) uses snake_case:
 * { amount, note, category_id, frequency, start_date, end_date? }
 */

export const RECURRENCE_FREQUENCIES = [
    { value: "weekly" as const, label: "Weekly" },
    { value: "monthly" as const, label: "Monthly" },
    { value: "yearly" as const, label: "Yearly" },
] as const;

export type RecurrenceFrequency = (typeof RECURRENCE_FREQUENCIES)[number]["value"];

export type RecurringExpenseListRow = {
    id: string;
    amount: number;
    note: string;
    categoryId: number;
    /** Resolved category name for display */
    categoryName: string;
    /** When API maps category to slug usable with getCategoryColor */
    categoryValue?: ExpenseCategory;
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
};

type CategoryLookup = { id: number; name: string }[];

function parseAmount(raw: unknown): number {
    if (typeof raw === "number" && !Number.isNaN(raw)) return raw;
    if (typeof raw === "string") {
        const n = parseFloat(raw);
        return Number.isNaN(n) ? 0 : n;
    }
    return 0;
}

function inferCategoryValue(name: string): ExpenseCategory | undefined {
    const n = name.toLowerCase();
    if (n.includes("food") || n.includes("dining")) return "food";
    if (n.includes("transport") || n.includes("gas")) return "transport";
    if (n.includes("shop")) return "shopping";
    if (n.includes("entertain")) return "entertainment";
    if (n.includes("bill") || n.includes("utilit")) return "bills";
    if (n.includes("health") || n.includes("medical")) return "healthcare";
    if (n.includes("edu") || n.includes("course")) return "education";
    if (n.includes("travel") || n.includes("hotel")) return "travel";
    return "other";
}

/**
 * Map API or mixed payload to a stable list row. Accepts Laravel date strings.
 */
export function mapToRecurringRow(
    raw: Record<string, unknown>,
    categories: CategoryLookup,
): RecurringExpenseListRow | null {
    if (raw == null || raw.id == null) return null;

    const id = String(raw.id);
    const amount = parseAmount(raw.amount);
    const note = String(
        raw.note ?? raw.description ?? raw.title ?? "Recurring",
    );
    const categoryId = Number(raw.category_id);
    const fromApiCat = raw.category as { name?: string; slug?: string } | null;
    const fromLookup = categories.find((c) => c.id === categoryId);
    const categoryName =
        (fromApiCat && typeof fromApiCat.name === "string"
            ? fromApiCat.name
            : null) ||
        (fromLookup && fromLookup.name) ||
        "—";

    const categoryValue =
        typeof fromApiCat?.slug === "string"
            ? (fromApiCat.slug as ExpenseCategory)
            : inferCategoryValue(categoryName);

    const freq = String(
        raw.frequency ?? "monthly",
    ).toLowerCase() as RecurrenceFrequency;
    const validFreq = RECURRENCE_FREQUENCIES.some((f) => f.value === freq)
        ? freq
        : "monthly";

    const startRaw = raw.start_date ?? raw.starts_at;
    const endRaw = raw.end_date ?? raw.ends_at;
    const startDate =
        typeof startRaw === "string"
            ? startRaw.split("T")[0]!
            : new Date().toISOString().split("T")[0]!;
    const endDate =
        endRaw == null
            ? null
            : typeof endRaw === "string"
              ? endRaw.split("T")[0]!
              : null;

    return {
        id,
        amount,
        note: note || "Recurring",
        categoryId: Number.isFinite(categoryId) ? categoryId : 0,
        categoryName,
        categoryValue,
        frequency: validFreq,
        startDate,
        endDate,
        isActive: raw.is_active !== false && raw.is_active !== 0,
    };
}

export function mapRecurringListResponse(
    data: unknown,
    categories: CategoryLookup,
): RecurringExpenseListRow[] {
    if (data == null) return [];
    let list: unknown[] = [];
    if (Array.isArray(data)) {
        list = data;
    } else if (typeof data === "object" && "data" in data) {
        const inner = (data as { data: unknown }).data;
        list = Array.isArray(inner) ? inner : [];
    }
    return list
        .map((row) => mapToRecurringRow(row as Record<string, unknown>, categories))
        .filter((r): r is RecurringExpenseListRow => r != null);
}

export function formatRecurrenceLabel(f: RecurrenceFrequency): string {
    return RECURRENCE_FREQUENCIES.find((x) => x.value === f)?.label ?? f;
}

/** Unwraps Laravel `{ data: { ... } }` or a plain object. */
export function mapRecurringDetail(
    raw: unknown,
    categories: CategoryLookup,
): RecurringExpenseListRow | null {
    if (raw == null) return null;
    let inner: Record<string, unknown>;
    if (typeof raw === "object" && raw !== null) {
        const o = raw as { data?: unknown };
        if (o.data != null && typeof o.data === "object") {
            inner = o.data as Record<string, unknown>;
        } else {
            inner = raw as Record<string, unknown>;
        }
    } else {
        return null;
    }
    return mapToRecurringRow(inner, categories);
}
