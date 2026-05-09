"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AuthPremiumShellProps = {
    children: ReactNode;
    /** Small label above title */
    eyebrow: string;
    title: string;
    description: string;
};

export function AuthPremiumShell({
    children,
    eyebrow,
    title,
    description,
}: AuthPremiumShellProps) {
    return (
        <div className="relative flex min-h-screen overflow-hidden bg-white">
            <div className="pointer-events-none absolute inset-0 lg:hidden">
                <div className="absolute -left-1/4 top-0 h-64 w-[150%] bg-gradient-to-br from-violet-600/90 via-fuchsia-600/50 to-indigo-600/80 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-zinc-950 px-14 py-14 text-white lg:flex"
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-20 top-1/4 size-[420px] rounded-full bg-violet-500/25 blur-[100px]" />
                    <div className="absolute -right-10 bottom-0 size-[380px] rounded-full bg-fuchsia-500/20 blur-[90px]" />
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 font-bold shadow-lg shadow-violet-500/30 ring-1 ring-white/20">
                            ET
                        </div>
                        <span className="text-lg font-semibold tracking-tight">
                            ExpenseTracker
                        </span>
                    </div>
                    <div className="mt-16 max-w-md space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">
                            {eyebrow}
                        </p>
                        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight">
                            {title}
                        </h1>
                        <p className="text-base leading-relaxed text-zinc-400">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 border-t border-white/10 pt-10">
                    <div className="flex flex-wrap gap-8 text-sm">
                        <div>
                            <p className="font-mono text-2xl font-semibold text-white">
                                10+
                            </p>
                            <p className="mt-1 text-zinc-500">Currencies</p>
                        </div>
                        <div>
                            <p className="font-mono text-2xl font-semibold text-white">
                                24/7
                            </p>
                            <p className="mt-1 text-zinc-500">Your data, yours</p>
                        </div>
                        <div>
                            <p className="font-mono text-2xl font-semibold text-white">
                                AES
                            </p>
                            <p className="mt-1 text-zinc-500">Industry standards</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="relative z-10 flex w-full flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:w-[48%] lg:px-14 lg:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("mx-auto w-full max-w-[420px]")}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
