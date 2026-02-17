"use client";

import { setAuthToken } from "@/config/api";
import { useAuth } from "@/context/auth-context";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { loginApi } from "@/config/api";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUserFromLogin } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/dashboard";

    const loginMutation = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            setAuthToken(data.token);
            setUserFromLogin(data.user);
            toast.success("Welcome back!");
            router.push(redirect);
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            const message =
                error.response?.data?.message ?? "Invalid email or password";
            toast.error(message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        disabled={loginMutation.isPending}
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        disabled={loginMutation.isPending}
                        className="h-11"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full h-11"
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? (
                        <span className="flex items-center gap-2">
                            <span
                                className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                                aria-hidden
                            />
                            Signing in...
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>
        </div>
    );
}
