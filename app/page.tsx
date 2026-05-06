import CallToAction from "@/components/landing/call-to-action";
import ApplicationFeatures from "@/components/landing/features";
import HeroSection from "@/components/landing/hero-section";
import LandingFooter from "@/components/landing/landing-footer";
import Navbar from "@/components/landing/navbar";
import ProductShowcase from "@/components/landing/product-showcase";
import StatsBand from "@/components/landing/stats-band";
import TrustScenarios from "@/components/landing/trust-scenarios";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ExpenseTracker - Take Control of Your Finances",
    description:
        "See your dashboard and analytics before you sign up. Track expenses, understand trends, and spend with confidence.",
};

export default function Home() {
    return (
        <div
            className="min-h-screen text-slate-900 antialiased selection:bg-teal-200/60 selection:text-teal-950"
            style={{
                background:
                    "radial-gradient(ellipse 120% 70% at 50% -8%, rgba(45, 212, 191, 0.09), transparent 52%), radial-gradient(ellipse 60% 40% at 100% 40%, rgba(139, 92, 246, 0.06), transparent 45%), linear-gradient(180deg, #fafcfb 0%, #ffffff 38%, #f4f5f7 100%)",
            }}
        >
            <Navbar />

            <HeroSection />

            <ProductShowcase />

            <StatsBand />

            <ApplicationFeatures />

            <TrustScenarios />

            <CallToAction />

            <LandingFooter />
        </div>
    );
}
