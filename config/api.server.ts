import { clearAuthToken } from "@/lib/auth";
import axios, { AxiosError, AxiosInstance } from "axios";
const API_BASE_URL = "http://localhost:8000/api";

export const AUTH_TOKEN_KEY = "auth_token";

export const apiServer = (authToken?: string): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(authToken && {
                Authorization: `Bearer ${authToken}`,
            }),
        },
    });

    instance.interceptors.response.use(
        (response) => {
            console.log("response", response);
            return response;
        },
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                clearAuthToken();
            }
            return Promise.reject(error);
        },
    );

    return instance;
};

export default apiServer();
