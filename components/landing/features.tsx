"use client";

import {
    Reveal,
    RevealItem,
    RevealStagger,
} from "@/components/landing/scroll-reveal";

export default function ApplicationFeatures() {
    return (
        <section
            id="features"
            className="relative overflow-hidden py-24 sm:py-32"
        >
            <div
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(45,212,191,0.06),transparent_55%)]"
                aria-hidden
            />
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <Reveal className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Everything you need to manage expenses
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                        Powerful features designed to make expense tracking
                        effortless and insightful.
                    </p>
                </Reveal>

                <RevealStagger className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:max-w-none lg:grid-cols-3">
                    <RevealItem>
                        <div className="group relative h-full rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/90 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-teal-200/80 hover:shadow-[0_20px_48px_-12px_rgba(13,148,136,0.12)]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-600/25">
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900">
                                Quick Entry
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Add expenses in seconds with our intuitive
                                interface. Categorize automatically and never
                                lose track.
                            </p>
                        </div>
                    </RevealItem>
                    <RevealItem>
                        <div className="group relative h-full rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/90 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-violet-200/80 hover:shadow-[0_20px_48px_-12px_rgba(139,92,246,0.12)]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-600/25">
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900">
                                Visual Analytics
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Beautiful charts and insights help you understand
                                where your money goes and identify spending
                                patterns.
                            </p>
                        </div>
                    </RevealItem>
                    <RevealItem>
                        <div className="group relative h-full rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/90 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-indigo-200/80 hover:shadow-[0_20px_48px_-12px_rgba(99,102,241,0.12)]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-600/25">
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900">
                                Smart Categories
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Organize expenses with customizable categories.
                                Track food, transport, rent, and more with ease.
                            </p>
                        </div>
                    </RevealItem>
                    <RevealItem>
                        <div className="group relative h-full rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/90 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-200/80 hover:shadow-[0_20px_48px_-12px_rgba(16,185,129,0.12)]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-600/25">
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900">
                                Secure & Private
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Your financial data stays protected. We never
                                sell your information.
                            </p>
                        </div>
                    </RevealItem>
                    <RevealItem>
                        <div className="group relative h-full rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/90 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-orange-200/80 hover:shadow-[0_20px_48px_-12px_rgba(249,115,22,0.12)]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-600/25">
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900">
                                Date Filtering
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Filter expenses by date range to analyze
                                spending over specific periods. Perfect for
                                monthly budgeting.
                            </p>
                        </div>
                    </RevealItem>
                    <RevealItem>
                        <div className="group relative h-full rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/90 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-rose-200/80 hover:shadow-[0_20px_48px_-12px_rgba(244,63,94,0.12)]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-600/25">
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900">
                                Mobile Friendly
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Access your expenses anywhere, anytime. Responsive
                                design works beautifully on all devices.
                            </p>
                        </div>
                    </RevealItem>
                </RevealStagger>
            </div>
        </section>
    );
}
