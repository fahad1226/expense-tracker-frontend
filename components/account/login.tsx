"use client";

import { GoogleIdentityButton } from "@/components/account/google-identity-button";
import {
    getAuthErrorMessage,
    googleAuthApi,
    loginApi,
    setAuthToken,
} from "@/lib/auth";
import { useAuth } from "@/context/auth-context";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
    const { setUserFromLogin } = useAuth();

    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const redirect = searchParams.get("redirect") ?? "/dashboard";

    const loginMutation = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            setAuthToken(data.token);
            setUserFromLogin(data.user);
            toast.success("Welcome back!");
            router.push(redirect);
        },
        onError: (error: unknown) => {
            toast.error(
                getAuthErrorMessage(error, "Invalid email or password"),
            );
        },
    });

    const googleMutation = useMutation({
        mutationFn: googleAuthApi,
        onSuccess: (data) => {
            setAuthToken(data.token);
            setUserFromLogin(data.user);
            toast.success("Signed in with Google");
            router.push(redirect);
        },
        onError: (error: unknown) => {
            toast.error(
                getAuthErrorMessage(error, "Google sign-in failed."),
            );
        },
    });

    const busy = loginMutation.isPending || googleMutation.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white/80 p-1 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-2">
            <div className="rounded-xl bg-white px-6 py-8 sm:px-8">
                <div className="mb-8 flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-md shadow-violet-500/25">
                        <LogIn className="size-5" aria-hidden />
                    </span>
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                            Welcome back
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500">
                            Sign in with Google or your email.
                        </p>
                    </div>
                </div>

                <GoogleIdentityButton
                    variant="signin_with"
                    disabled={busy}
                    onCredential={(c) => googleMutation.mutate(c)}
                    className="mb-6"
                />

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 font-medium text-neutral-400">
                            or with email
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-neutral-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            disabled={busy}
                            className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-neutral-700"
                            >
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-xs font-medium text-violet-600 hover:text-violet-700"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                disabled={busy}
                                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={busy}
                        className="group relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65"
                    >
                        <span className="relative z-10">
                            {loginMutation.isPending ? "Signing in…" : "Sign in"}
                        </span>
                        <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-neutral-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-neutral-900 underline-offset-4 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
