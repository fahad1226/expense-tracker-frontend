import Link from "next/link"

function HeroSection() {
    return (
        <>
            <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
                {/* Background decoration */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl">
                        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20"></div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
                            Take Control of Your
                            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Finances
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
                            Track every expense, understand your spending patterns, and make smarter financial decisions.
                            Beautiful, simple, and powerful expense management designed for modern life.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4">
                            <Link
                                href="/signup"
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105"
                            >
                                Start Tracking Free
                            </Link>
                            <Link
                                href="#features"
                                className="rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                            >
                                Learn More
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            No credit card required • Free forever
                        </p>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-16">
                        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200/50 bg-white/50 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/50">
                            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 dark:from-slate-800 dark:to-slate-900">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <div className="h-3 w-32 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                        <div className="mt-2 h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                                        <div className="h-8 w-8 rounded-full bg-indigo-500"></div>
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
                                        <div className="text-sm text-slate-500 dark:text-slate-400">This Month</div>
                                        <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">$2,450</div>
                                        <div className="mt-1 text-xs text-green-600">↓ 12% from last month</div>
                                    </div>
                                    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
                                        <div className="text-sm text-slate-500 dark:text-slate-400">Categories</div>
                                        <div className="mt-4 flex gap-2">
                                            <div className="h-2 flex-1 rounded-full bg-blue-500"></div>
                                            <div className="h-2 flex-1 rounded-full bg-indigo-500"></div>
                                            <div className="h-2 flex-1 rounded-full bg-purple-500"></div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
                                        <div className="text-sm text-slate-500 dark:text-slate-400">Recent</div>
                                        <div className="mt-2 space-y-2">
                                            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                            <div className="h-2 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HeroSection