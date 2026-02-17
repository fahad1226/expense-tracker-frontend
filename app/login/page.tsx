import { LoginForm } from "@/components/account/login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ExpenseTracker - Login",
    description:
        "Login to your ExpenseTracker account to start tracking your expenses.",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
            <LoginForm />
        </div>
    );
}
