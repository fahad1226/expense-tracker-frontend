"use client";

import { easeLux } from "@/components/landing/scroll-reveal";
import { motion, useReducedMotion } from "framer-motion";
import { SparklesIcon } from "lucide-react";

export default function StatsBand() {
    const reduceMotion = useReducedMotion();

    const stats = [
        {
            value: "Clear",
            label: "Dashboard and analytics laid out so you see the story fast",
        },
        {
            value: "Protected",
            label: "Signed-in experience served over HTTPS like modern apps should",
        },
        {
            value: "Yours",
            label: "Your expenses and categories stay tied to your account",
        },
    ];

    return (
        <section className="relative overflow-hidden border-y border-teal-100/80 bg-gradient-to-b from-white via-teal-50/35 to-slate-50 py-20 sm:py-24">
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                aria-hidden
            >
                <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-teal-200/25 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    className="mx-auto flex max-w-2xl flex-col items-center text-center"
                    initial={
                        reduceMotion ? undefined : { opacity: 0, y: 24 }
                    }
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.6, ease: easeLux }
                    }
                >
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800 shadow-sm backdrop-blur-sm">
                        <SparklesIcon className="size-3.5 text-teal-600" />
                        Built for trust
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Clarity, security, and control—without the jargon
                    </h2>
                    <p className="mt-3 text-slate-600 leading-relaxed sm:text-lg">
                        A calm foundation so you can focus on decisions, not
                        noise.
                    </p>
                </motion.div>

                <motion.ul
                    className="mt-14 grid gap-5 sm:grid-cols-3 sm:gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={
                        reduceMotion
                            ? {
                                  hidden: {},
                                  visible: {
                                      transition: {
                                          staggerChildren: 0.01,
                                          delayChildren: 0,
                                      },
                                  },
                              }
                            : {
                                  hidden: {},
                                  visible: {
                                      transition: {
                                          staggerChildren: 0.12,
                                          delayChildren: 0.08,
                                      },
                                  },
                              }
                    }
                >
                    {stats.map((s) => (
                        <motion.li
                            key={s.label}
                            variants={
                                reduceMotion
                                    ? {
                                          hidden: { opacity: 1, y: 0 },
                                          visible: { opacity: 1, y: 0 },
                                      }
                                    : {
                                          hidden: { opacity: 0, y: 22 },
                                          visible: {
                                              opacity: 1,
                                              y: 0,
                                              transition: {
                                                  duration: 0.55,
                                                  ease: easeLux,
                                              },
                                          },
                                      }
                            }
                            className="group relative rounded-3xl border border-white/80 bg-white/75 p-8 text-center shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/90 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-12px_rgba(13,148,136,0.12)]"
                        >
                            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-teal-200/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                            <div className="text-2xl font-bold tracking-tight text-transparent sm:text-3xl bg-gradient-to-r from-teal-600 via-slate-800 to-violet-600 bg-clip-text">
                                {s.value}
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                {s.label}
                            </p>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </section>
    );
}
