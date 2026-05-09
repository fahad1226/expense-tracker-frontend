import { SignupForm } from "@/components/account/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ExpenseTracker — Sign up",
    description:
        "Create your ExpenseTracker account. Email, password, or Google.",
};

export default function SignupPage() {
    return <SignupForm />;
}
