import { AUTH_TOKEN_KEY } from "@/config/api.client";
import axios, { AxiosError, AxiosInstance } from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export { AUTH_TOKEN_KEY };

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
        (error: AxiosError) => Promise.reject(error),
    );

    return instance;
};

export default apiServer();
