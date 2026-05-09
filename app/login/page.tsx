import { AuthPremiumShell } from "@/components/account/auth-premium-shell";
import { LoginForm } from "@/components/account/login";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ExpenseTracker — Sign in",
    description:
        "Sign in to ExpenseTracker to track spending and stay on budget.",
};

export default function LoginPage() {
    return (
        <AuthPremiumShell
            eyebrow="Sign in"
            title="Your finances, distilled."
            description="See spending by category, set budgets, and export reports—all synced securely with your workspace."
        >
            <LoginForm />
        </AuthPremiumShell>
    );
}
