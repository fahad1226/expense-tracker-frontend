"use client";

import { AuthPremiumShell } from "@/components/account/auth-premium-shell";
import { GoogleIdentityButton } from "@/components/account/google-identity-button";
import {
    getAuthErrorMessage,
    googleAuthApi,
    registerApi,
    setAuthToken,
} from "@/lib/auth";
import { useAuth } from "@/context/auth-context";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SignupForm() {
    const { setUserFromLogin } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/dashboard";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const registerMutation = useMutation({
        mutationFn: registerApi,
        onSuccess: (data) => {
            setAuthToken(data.token);
            setUserFromLogin(data.user);
            toast.success("Account created — welcome aboard!");
            router.push(redirect);
        },
        onError: (error: unknown) => {
            toast.error(
                getAuthErrorMessage(error, "Could not create your account."),
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

    const busy = registerMutation.isPending || googleMutation.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate({
            name: name.trim(),
            email: email.trim(),
            password,
            password_confirmation: passwordConfirmation,
        });
    };

    return (
        <AuthPremiumShell
            eyebrow="Get started"
            title="Build clarity into every expense."
            description="Create your workspace in seconds. Secure authentication, multi-currency support, and insights designed for how you actually spend."
        >
            <div className="rounded-2xl border border-neutral-200/80 bg-white/80 p-1 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-2">
                <div className="rounded-xl bg-white px-6 py-8 sm:px-8">
                    <div className="mb-8 flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-md shadow-violet-500/25">
                            <Sparkles className="size-5" aria-hidden />
                        </span>
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                                Create your account
                            </h2>
                            <p className="mt-1 text-sm text-neutral-500">
                                Email and password, or continue with Google.
                            </p>
                        </div>
                    </div>

                    <GoogleIdentityButton
                        variant="signup_with"
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
                                or register with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="signup-name"
                                className="text-sm font-medium text-neutral-700"
                            >
                                Full name
                            </label>
                            <input
                                id="signup-name"
                                type="text"
                                autoComplete="name"
                                placeholder="Alex Morgan"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={busy}
                                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="signup-email"
                                className="text-sm font-medium text-neutral-700"
                            >
                                Email
                            </label>
                            <input
                                id="signup-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={busy}
                                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="signup-password"
                                className="text-sm font-medium text-neutral-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="signup-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    disabled={busy}
                                    className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
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

                        <div className="space-y-1.5">
                            <label
                                htmlFor="signup-password-confirm"
                                className="text-sm font-medium text-neutral-700"
                            >
                                Confirm password
                            </label>
                            <input
                                id="signup-password-confirm"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Repeat password"
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                                required
                                minLength={8}
                                disabled={busy}
                                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={busy}
                            className="group relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-500/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65"
                        >
                            <span className="relative z-10">
                                {registerMutation.isPending
                                    ? "Creating account…"
                                    : "Create account"}
                            </span>
                            <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs leading-relaxed text-neutral-500">
                        By signing up you agree to our{" "}
                        <Link
                            href="/terms"
                            className="font-medium text-violet-600 hover:text-violet-700"
                        >
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="font-medium text-violet-600 hover:text-violet-700"
                        >
                            Privacy
                        </Link>
                        .
                    </p>

                    <p className="mt-4 text-center text-sm text-neutral-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-neutral-900 underline-offset-4 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </AuthPremiumShell>
    );
}
