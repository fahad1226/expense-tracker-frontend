import axios, { AxiosError, AxiosInstance } from "axios";
import Cookie from "js-cookie";
const API_BASE_URL = "http://localhost:8000/api";

export const AUTH_TOKEN_KEY = "auth_token";

export const apiClient = (): AxiosInstance => {
    const authToken = Cookie.get(AUTH_TOKEN_KEY);

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
        (error:AxiosError) => {
            console.log("error from interceptor", error.response?.data);
            return Promise.reject(error);
        },
    );

    return instance;
};

export default apiClient();
