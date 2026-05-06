"use client";

import {
    DashboardPreviewMock,
    PhonePreviewOutline,
} from "@/components/landing/landing-previews";
import { easeLux } from "@/components/landing/scroll-reveal";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ReceiptIcon, ShieldCheckIcon, StarIcon } from "lucide-react";

function HeroSection() {
    const reduceMotion = useReducedMotion();

    return (
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pb-28">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute right-0 top-0 h-[min(70vh,640px)] w-[min(70vw,720px)] rounded-full bg-gradient-to-br from-teal-400/15 via-violet-400/20 to-indigo-300/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-16">
                    <motion.div
                        className="max-w-xl lg:max-w-none"
                        initial={
                            reduceMotion ? undefined : { opacity: 0, y: 32 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : { duration: 0.65, ease: easeLux }
                        }
                    >
                        <p className="inline-flex items-center gap-2 rounded-full border border-teal-700/15 bg-teal-50/80 px-3 py-1 text-xs font-semibold text-teal-900 shadow-sm">
                            <ShieldCheckIcon className="size-3.5" />
                            Secure · Private · Built for clarity
                        </p>
                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                            See your money clearly.
                            <span className="mt-1 block bg-gradient-to-r from-teal-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                Spend with confidence.
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
                            Track expenses, spot trends in analytics, and stay
                            on budget—before you sign up, preview exactly how the
                            app looks and feels.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                            >
                                Get started free
                            </Link>
                            <Link
                                href="#product"
                                className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2"
                            >
                                View product tour
                            </Link>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
                            <div className="flex items-center gap-0.5 text-amber-500">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <StarIcon
                                        key={i}
                                        className="size-4 fill-current"
                                    />
                                ))}
                            </div>
                            <span className="font-medium text-slate-900">
                                Loved by people who want less money stress
                            </span>
                            <span className="hidden h-4 w-px bg-slate-200 sm:inline" />
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                Free plan available
                            </span>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-8">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Works alongside tools you use
                            </span>
                            <div className="flex flex-wrap items-center gap-6 opacity-70 grayscale">
                                {["Teams", "Freelance", "Families"].map(
                                    (name) => (
                                        <span
                                            key={name}
                                            className="text-sm font-bold text-slate-700"
                                        >
                                            {name}
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none"
                        initial={
                            reduceMotion ? undefined : { opacity: 0, y: 40 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : {
                                      duration: 0.75,
                                      delay: 0.12,
                                      ease: easeLux,
                                  }
                        }
                    >
                        <div className="absolute -right-4 top-8 z-10 hidden sm:block lg:-right-8 lg:top-12">
                            <PhonePreviewOutline />
                        </div>
                        <div className="relative z-0 translate-y-2 sm:translate-y-0">
                            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-teal-500/20 via-violet-500/15 to-transparent opacity-80 blur-2xl" />
                            <div className="relative rotate-0 transform lg:translate-x-2">
                                <DashboardPreviewMock />
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 sm:justify-end sm:pr-8">
                            <ReceiptIcon className="size-3.5 text-violet-500" />
                            Real layout from your future dashboard
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
