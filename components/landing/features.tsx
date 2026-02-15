export default function ApplicationFeatures() {
    return (
        <>
            <section id="features" className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Everything you need to manage expenses
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                            Powerful features designed to make expense tracking effortless and insightful.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="group relative rounded-2xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-sm transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-blue-700">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                                Quick Entry
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Add expenses in seconds with our intuitive interface. Categorize automatically and never lose track.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative rounded-2xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-sm transition-all hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-indigo-700">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                                Visual Analytics
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Beautiful charts and insights help you understand where your money goes and identify spending patterns.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative rounded-2xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-sm transition-all hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-purple-700">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                                Smart Categories
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Organize expenses with customizable categories. Track food, transport, rent, and more with ease.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group relative rounded-2xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-sm transition-all hover:border-green-300 hover:shadow-xl hover:shadow-green-500/10 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-green-700">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                                Secure & Private
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Your financial data is encrypted and secure. We never share your information with third parties.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group relative rounded-2xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-sm transition-all hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-orange-700">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                                Date Filtering
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Filter expenses by date range to analyze spending over specific periods. Perfect for monthly budgeting.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group relative rounded-2xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-sm transition-all hover:border-pink-300 hover:shadow-xl hover:shadow-pink-500/10 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-pink-700">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                                Mobile Friendly
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Access your expenses anywhere, anytime. Our responsive design works perfectly on all devices.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
