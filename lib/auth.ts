import { apiClient, AUTH_TOKEN_KEY } from "@/config/api.client";
import axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";
export const API_BASE_URL = "http://localhost:8000/api";

const AUTH_COOKIE_ATTRS = {
    path: "/",
    sameSite: "lax" as const,
};

export function setAuthToken(token: string, maxAgeDays = 7): void {
    Cookies.set(AUTH_TOKEN_KEY, token, {
        expires: maxAgeDays,
        ...AUTH_COOKIE_ATTRS,
    });
}

export function clearAuthToken(): void {
    Cookies.remove(AUTH_TOKEN_KEY, { path: AUTH_COOKIE_ATTRS.path });
}

export function getAuthToken(): string | undefined {
    return Cookies.get(AUTH_TOKEN_KEY);
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    currency: string;
    /** Absolute URL from the API when the user has uploaded a photo */
    avatar_url?: string | null;
}

export interface LoginResponse {
    token: string;
    user: User;
}

function normalizeLoginResponse(data: LoginResponse): LoginResponse {
    const u = data.user;
    return {
        ...data,
        user: {
            ...u,
            currency:
                u.currency && u.currency.length === 3 ? u.currency : "BDT",
            avatar_url: u.avatar_url ?? null,
        },
    };
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error)) {
        const d = error.response?.data as {
            message?: string;
            errors?: Record<string, string[]>;
        };
        if (d?.errors) {
            const first = Object.values(d.errors).flat()[0];
            if (first) return first;
        }
        if (typeof d?.message === "string") return d.message;
    }
    if (error instanceof Error) return error.message;
    return fallback;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export async function registerApi(
    payload: RegisterPayload,
): Promise<LoginResponse> {
    const res = await axios.post<LoginResponse>(
        API_BASE_URL + "/auth/register",
        payload,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        },
    );
    return normalizeLoginResponse(res.data);
}

export async function googleAuthApi(credential: string): Promise<LoginResponse> {
    const res = await axios.post<LoginResponse>(
        API_BASE_URL + "/auth/google",
        { credential },
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        },
    );
    return normalizeLoginResponse(res.data);
}

export async function loginApi(
    credentials: LoginCredentials,
): Promise<LoginResponse> {
    const res = await axios.post<LoginResponse>(
        API_BASE_URL + "/auth/login",
        credentials,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        },
    );
    return normalizeLoginResponse(res.data);
}

export async function logoutApi(): Promise<void> {
    try {
        await apiClient().post("/auth/logout");
    } finally {
        clearAuthToken();
    }
}

export async function getMeApi(): Promise<User> {
    const res = await apiClient().get<{ user: User }>("/auth/user");
    const u = res.data.user;
    return {
        ...u,
        currency: u.currency && u.currency.length === 3 ? u.currency : "BDT",
        avatar_url: u.avatar_url ?? null,
    };
}
