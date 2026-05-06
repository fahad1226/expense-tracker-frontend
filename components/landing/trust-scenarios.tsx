"use client";

import { Reveal, RevealItem, RevealStagger } from "@/components/landing/scroll-reveal";

const scenarios = [
    {
        title: "Less spreadsheet fatigue",
        body: "Many people want balances and categories without rebuilding pivot tables every week—a dashboard that stays readable.",
    },
    {
        title: "Spending you can explain",
        body: 'Charts and date ranges help answer "where did it go?" without digging through old statements.',
    },
    {
        title: "Households and side projects",
        body: "Flexible categories fit groceries, subscriptions, and business costs in one place when life doesn't stay in one bucket.",
    },
];

export default function TrustScenarios() {
    return (
        <section id="trust" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <Reveal className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Why a calmer expense app matters
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                        Common needs we designed for—so you know what to expect
                        before you create an account.
                    </p>
                </Reveal>
                <RevealStagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {scenarios.map((item) => (
                        <RevealItem key={item.title}>
                            <div className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white/95 p-7 shadow-[0_16px_48px_-16px_rgba(15,23,42,0.1)] ring-1 ring-slate-100/90 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_-16px_rgba(13,148,136,0.1)]">
                                <h3 className="font-semibold text-slate-900">
                                    {item.title}
                                </h3>
                                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                                    {item.body}
                                </p>
                            </div>
                        </RevealItem>
                    ))}
                </RevealStagger>
            </div>
        </section>
    );
}
