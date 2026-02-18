import { LoginForm } from "@/components/account/login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ExpenseTracker - Login",
    description:
        "Login to your ExpenseTracker account to start tracking your expenses.",
};

export default function LoginPage() {
    return (
        <div className="flex min-h-screen">
            {/* Left panel - Login form */}
            <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-[45%] lg:px-16">
                <LoginForm />
            </div>

            {/* Right panel - Decorative with subtle pattern */}
            <div className="relative hidden lg:flex lg:w-[55%] flex-col justify-between bg-neutral-50 p-12">
                {/* Subtle stripe pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 2px,
                            #000 2px,
                            #000 3px
                        )`,
                    }}
                />
                <div className="relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900">
                            <span className="text-lg font-bold text-white">
                                $
                            </span>
                        </div>
                        <span className="text-xl font-semibold text-neutral-900">
                            ExpenseTracker
                        </span>
                    </div>
                </div>
                <div className="relative z-10">
                    <blockquote className="space-y-4">
                        <p className="text-lg leading-relaxed text-neutral-600">
                            &ldquo;Take control of your finances. Track every
                            expense, understand your spending, and build better
                            habits.&rdquo;
                        </p>
                        <footer className="text-sm font-medium text-neutral-500">
                            — ExpenseTracker
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
