import Link from "next/link"

function CallToAction() {
    return (
        <>
            {/* CTA Section */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-24 text-center shadow-2xl sm:px-16 sm:py-32">
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl">
                                <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-white/20 to-transparent opacity-20"></div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to take control of your finances?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                            Join thousands of users who are already tracking their expenses smarter. Start your free account today.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4">
                            <Link
                                href="/signup"
                                className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:scale-105"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-xl border-2 border-white/50 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CallToAction