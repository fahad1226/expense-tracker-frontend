import CallToAction from "@/components/landing/call-to-action";
import ApplicationFeatures from "@/components/landing/features";
import LandingFooter from "@/components/landing/landing-footer";
import HeroSection from "@/components/landing/hero-section";
import Navbar from "@/components/landing/navbar";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "ExpenseTracker - Take Control of Your Finances",
  description: "Track your expenses effortlessly. Beautiful, simple, and powerful expense management for modern life.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">

      <Navbar />

      <HeroSection />

      <ApplicationFeatures />

      <CallToAction />

      <LandingFooter />

    </div>
  );
}
