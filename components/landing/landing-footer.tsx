import Link from "next/link";

function LandingFooter() {
    return (
        <>
            <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                                <span className="text-lg font-bold text-white">
                                    $
                                </span>
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                ExpenseTracker
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                            <Link
                                href="#"
                                className="transition-colors hover:text-slate-900 dark:hover:text-white"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="#"
                                className="transition-colors hover:text-slate-900 dark:hover:text-white"
                            >
                                Terms
                            </Link>
                            <Link
                                href="#"
                                className="transition-colors hover:text-slate-900 dark:hover:text-white"
                            >
                                Support
                            </Link>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            © {new Date().getFullYear()} ExpenseTracker. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default LandingFooter;
