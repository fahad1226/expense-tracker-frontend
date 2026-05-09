import { apiClient } from "@/config/api.client";
import { API_BASE_URL, getAuthToken, type User } from "@/lib/auth";

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
        avatar_url: u.avatar_url ?? null,
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

export async function uploadAvatarApi(file: File): Promise<SettingsPayload> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API_BASE_URL}/settings/avatar`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Upload failed");
    }

    const data = (await res.json()) as SettingsPayload;
    return {
        user: normalizeUser(data.user),
        currencies: data.currencies,
    };
}

export async function removeAvatarApi(): Promise<SettingsPayload> {
    const { data } = await apiClient().delete<SettingsPayload>(
        "/settings/avatar",
    );
    return {
        user: normalizeUser(data.user),
        currencies: data.currencies,
    };
}
