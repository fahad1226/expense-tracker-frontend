/**
 * Active currency for {@link formatMoney} / {@link formatCurrency}.
 * Synced from the authenticated user's preference (default BDT).
 */
export const DEFAULT_CURRENCY = "BDT";

let activeCurrencyCode: string = DEFAULT_CURRENCY;

/** ISO 4217 — keep aligned with backend `SupportedCurrencies`. */
export const SUPPORTED_CURRENCIES = [
    { code: "BDT", label: "Bangladeshi Taka" },
    { code: "USD", label: "US Dollar" },
    { code: "EUR", label: "Euro" },
    { code: "GBP", label: "British Pound" },
    { code: "INR", label: "Indian Rupee" },
    { code: "AUD", label: "Australian Dollar" },
    { code: "CAD", label: "Canadian Dollar" },
    { code: "JPY", label: "Japanese Yen" },
    { code: "SGD", label: "Singapore Dollar" },
    { code: "AED", label: "UAE Dirham" },
] as const;

export function setActiveCurrency(code: string | undefined | null): void {
    if (typeof code === "string" && /^[A-Za-z]{3}$/.test(code)) {
        activeCurrencyCode = code.toUpperCase();
    } else {
        activeCurrencyCode = DEFAULT_CURRENCY;
    }
}

export function getActiveCurrency(): string {
    return activeCurrencyCode;
}

export function formatMoney(
    amount: number,
    currencyCode: string = activeCurrencyCode,
): string {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode,
        }).format(amount);
    } catch {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: DEFAULT_CURRENCY,
        }).format(amount);
    }
}
