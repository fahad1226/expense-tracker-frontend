"use client";

import {
    AnalyticsPreviewMock,
    DashboardPreviewMock,
} from "@/components/landing/landing-previews";
import { easeLux, Reveal } from "@/components/landing/scroll-reveal";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart3Icon, LineChartIcon } from "lucide-react";

export default function ProductShowcase() {
    const reduceMotion = useReducedMotion();

    return (
        <section
            id="product"
            aria-labelledby="product-heading"
            className="border-y border-slate-200/70 bg-gradient-to-b from-white to-slate-50/90 py-20 sm:py-28"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <Reveal className="mx-auto max-w-2xl text-center">
                    <h2
                        id="product-heading"
                        className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                    >
                        Know the product before you commit
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                        Transparent previews of your dashboard and analytics—so
                        you can see how we present spending, trends, and
                        categories.
                    </p>
                </Reveal>

                <div className="mt-16 flex flex-col gap-16 lg:gap-24">
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <motion.div
                            className="order-2 lg:order-1"
                            initial={
                                reduceMotion ? undefined : { opacity: 0, x: -24 }
                            }
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={
                                reduceMotion
                                    ? { duration: 0 }
                                    : { duration: 0.65, ease: easeLux }
                            }
                        >
                            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800 ring-1 ring-violet-200/60">
                                <BarChart3Icon className="size-3.5" />
                                Dashboard
                            </div>
                            <h3 className="mt-4 text-2xl font-bold text-slate-900">
                                Your spending at a glance
                            </h3>
                            <p className="mt-3 text-slate-600 leading-relaxed">
                                Month-to-date totals, category breakdowns, and
                                quick actions—designed so you can log expenses
                                and understand habits in one calm screen.
                            </p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                {[
                                    "Summaries that update as you add expenses",
                                    "Visual overview for faster decisions",
                                    "Consistent with the signed-in experience",
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-2"
                                    >
                                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/signup"
                                className="mt-8 inline-flex font-semibold text-violet-700 underline decoration-violet-300 underline-offset-4 hover:text-violet-900"
                            >
                                Create free account →
                            </Link>
                        </motion.div>
                        <motion.div
                            className="order-1 lg:order-2"
                            initial={
                                reduceMotion ? undefined : { opacity: 0, x: 28 }
                            }
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={
                                reduceMotion
                                    ? { duration: 0 }
                                    : {
                                          duration: 0.65,
                                          delay: 0.08,
                                          ease: easeLux,
                                      }
                            }
                        >
                            <DashboardPreviewMock />
                        </motion.div>
                    </div>

                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <motion.div
                            initial={
                                reduceMotion ? undefined : { opacity: 0, x: -28 }
                            }
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={
                                reduceMotion
                                    ? { duration: 0 }
                                    : { duration: 0.65, ease: easeLux }
                            }
                        >
                            <AnalyticsPreviewMock />
                        </motion.div>
                        <motion.div
                            initial={
                                reduceMotion ? undefined : { opacity: 0, x: 24 }
                            }
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={
                                reduceMotion
                                    ? { duration: 0 }
                                    : {
                                          duration: 0.65,
                                          delay: 0.08,
                                          ease: easeLux,
                                      }
                            }
                        >
                            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900 ring-1 ring-teal-200/60">
                                <LineChartIcon className="size-3.5" />
                                Analytics
                            </div>
                            <h3 className="mt-4 text-2xl font-bold text-slate-900">
                                Trends you can trust
                            </h3>
                            <p className="mt-3 text-slate-600 leading-relaxed">
                                Range presets, comparisons, and clear
                                charts—built so patterns are obvious, not buried
                                in spreadsheets.
                            </p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                {[
                                    "Spend-over-time and category insights",
                                    "Readable defaults for weekly and monthly views",
                                    "Same analytics area you use after login",
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-2"
                                    >
                                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-violet-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/signup"
                                className="mt-8 inline-flex font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-900"
                            >
                                Start tracking →
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
