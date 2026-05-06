import { apiClient } from "@/config/api.client";
import type { User } from "@/lib/auth";

export type CurrencyOption = {
    code: string;
    label: string;
};

export type SettingsPayload = {
    user: User;
    currencies: CurrencyOption[];
};

function normalizeUser(u: User): User {
    return {
        ...u,
        currency: u.currency && u.currency.length === 3 ? u.currency : "BDT",
    };
}

export async function fetchSettings(): Promise<SettingsPayload> {
    const { data } = await apiClient().get<SettingsPayload>("/settings");
    return {
        user: normalizeUser(data.user),
        currencies: data.currencies,
    };
}

export async function patchSettings(updates: {
    name?: string;
    currency?: string;
}): Promise<SettingsPayload> {
    const { data } = await apiClient().patch<SettingsPayload>(
        "/settings",
        updates,
    );
    return {
        user: normalizeUser(data.user),
        currencies: data.currencies,
    };
}

export async function updatePasswordApi(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
}): Promise<void> {
    await apiClient().put("/settings/password", payload);
}
