import { apiClient } from "@/config/api.client";
import { AUTH_TOKEN_KEY } from "@/config/api.server";
import axios from "axios";
import Cookies from "js-cookie";
export const API_BASE_URL = "http://localhost:8000/api";

export function setAuthToken(token: string, maxAgeDays = 7): void {
    // if (typeof document === "undefined") return;
    // const maxAge = maxAgeDays * 24 * 60 * 60;
    // document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    Cookies.set(AUTH_TOKEN_KEY, token, { expires: maxAgeDays });
}

export function clearAuthToken(): void {
    // if (typeof document === "undefined") return;
    // document.cookie = AUTH_TOKEN_KEY + "=; path=/; max-age=0; SameSite=Lax";
    Cookies.remove(AUTH_TOKEN_KEY);
    // window.location.href = "/login";
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
    return res.data;
}

export async function logoutApi(): Promise<void> {
    try {
        await apiClient().post("/auth/logout");
    } finally {
        clearAuthToken();
    }
}

export async function getMeApi(): Promise<User> {
    const res = await apiClient().get<User>("/auth/user");
    return res.data;
}
