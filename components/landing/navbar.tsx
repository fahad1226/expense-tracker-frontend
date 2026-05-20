"use client";

import { easeLux } from "@/components/landing/scroll-reveal";
import { motion, useReducedMotion } from "framer-motion";
import { LayoutDashboardIcon, ReceiptIcon } from "lucide-react";
import Link from "next/link";

type NavbarProps = {
    /** Set from the server via cookies so nav matches session without a flash */
    isAuthenticated?: boolean;
};

function Navbar({ isAuthenticated = false }: NavbarProps) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70"
            initial={reduceMotion ? undefined : { y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={
                reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.5, ease: easeLux }
            }
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-violet-600 shadow-md shadow-teal-600/20">
                            <ReceiptIcon className="size-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            ExpenseTracker
                        </span>
                    </Link>
                    <div className="hidden items-center gap-8 md:flex">
                        <Link
                            href="#product"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            Product
                        </Link>
                        <Link
                            href="#features"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            Features
                        </Link>
                        <Link
                            href="#trust"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            Trust
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isAuthenticated && (
                            <Link
                                href="/login"
                                className="hidden text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900 sm:inline"
                            >
                                Sign in
                            </Link>
                        )}
                        <Link
                            href={isAuthenticated ? "/dashboard" : "/signup"}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition hover:shadow-lg hover:shadow-teal-600/35"
                        >
                            {isAuthenticated ? (
                                <>
                                    <LayoutDashboardIcon className="size-4 shrink-0 opacity-95" />
                                    Dashboard
                                </>
                            ) : (
                                "Get started"
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

export default Navbar;
