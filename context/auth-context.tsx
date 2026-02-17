"use client";

import {
    clearAuthToken,
    getMeApi,
    hasAuthToken,
    loginApi,
    logoutApi,
    setAuthToken,
    type User,
} from "@/config/api";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refetchUser: () => Promise<void>;
    setUserFromLogin: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refetchUser = useCallback(async () => {
        try {
            const userData = await getMeApi();
            setUser(userData);
        } catch {
            setUser(null);
            clearAuthToken();
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasAuthToken()) {
            setIsLoading(false);
            return;
        }
        refetchUser();
    }, [refetchUser]);

    const login = useCallback(
        async (email: string, password: string) => {
            const { token, user: userData } = await loginApi({ email, password });
            setAuthToken(token);
            setUser(userData);
        },
        []
    );

    const logout = useCallback(async () => {
        await logoutApi();
        setUser(null);
    }, []);

    const setUserFromLogin = useCallback((userData: User) => {
        setUser(userData);
    }, []);

    const value: AuthContextValue = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refetchUser,
        setUserFromLogin,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
