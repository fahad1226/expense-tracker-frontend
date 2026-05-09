import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from "axios";
import Cookie from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const AUTH_TOKEN_KEY = "auth_token";

export const apiClient = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const authToken = Cookie.get(AUTH_TOKEN_KEY);
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => Promise.reject(error),
    );

    return instance;
};
