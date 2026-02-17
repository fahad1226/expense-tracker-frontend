import axios, { AxiosInstance } from "axios";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const AUTH_TOKEN_KEY = "auth_token";

function getToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
        new RegExp("(?:^|; )" + AUTH_TOKEN_KEY + "=([^;]*)"),
    );
    return match ? decodeURIComponent(match[1]) : null;
}

export function hasAuthToken(): boolean {
    return !!getToken();
}

function createApiClient(): AxiosInstance {
    const instance = axios.create({
        baseURL: API_BASE_URL + "/api",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    instance.interceptors.request.use((config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                document.cookie =
                    AUTH_TOKEN_KEY + "=; path=/; max-age=0; SameSite=Lax";
                if (typeof window !== "undefined") {
                    window.location.href =
                        "/login?redirect=" +
                        encodeURIComponent(window.location.pathname);
                }
            }
            return Promise.reject(error);
        },
    );

    return instance;
}

const api = createApiClient();
export default api;

export function setAuthToken(token: string, maxAgeDays = 7): void {
    const maxAge = maxAgeDays * 24 * 60 * 60;
    document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthToken(): void {
    document.cookie = AUTH_TOKEN_KEY + "=; path=/; max-age=0; SameSite=Lax";
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
        API_BASE_URL + "/api/auth/login",
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
        await api.post("/auth/logout");
    } finally {
        clearAuthToken();
    }
}

export async function getMeApi(): Promise<User> {
    const res = await api.get<User>("/auth/user");
    return res.data;
}
