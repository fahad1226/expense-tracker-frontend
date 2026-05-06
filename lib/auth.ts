import { apiClient, AUTH_TOKEN_KEY } from "@/config/api.client";
import axios from "axios";
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
}

export interface LoginResponse {
    token: string;
    user: User;
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
    const u = res.data.user;
    return {
        ...res.data,
        user: {
            ...u,
            currency: u.currency && u.currency.length === 3 ? u.currency : "BDT",
        },
    };
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
    };
}
