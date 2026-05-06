"use client";

import { easeLux } from "@/components/landing/scroll-reveal";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

function CallToAction() {
    const reduceMotion = useReducedMotion();

    return (
        <section className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    className="relative isolate overflow-hidden rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-white via-teal-50/50 to-violet-50/40 px-6 py-16 text-center shadow-[0_24px_80px_-20px_rgba(15,23,42,0.12)] ring-1 ring-white/80 sm:px-12 sm:py-20"
                    initial={
                        reduceMotion ? undefined : { opacity: 0, y: 32 }
                    }
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.7, ease: easeLux }
                    }
                >
                    <div
                        className="pointer-events-none absolute inset-0 -z-10"
                        aria-hidden
                    >
                        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-200/25 blur-3xl" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Ready to see your spending clearly?
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                        You have already seen the dashboard and analytics
                        previews—create an account and use the same screens with
                        your own data.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/signup"
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal-600/30 transition hover:scale-[1.02] hover:shadow-xl sm:w-auto"
                        >
                            Get started free
                        </Link>
                        <Link
                            href="#product"
                            className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-slate-200/90 bg-white/80 px-8 py-4 text-base font-semibold text-slate-800 backdrop-blur-sm transition hover:border-slate-300 hover:bg-white sm:w-auto"
                        >
                            Back to product tour
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default CallToAction;
