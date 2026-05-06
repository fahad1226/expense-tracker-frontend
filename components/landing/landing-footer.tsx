"use client";

import { easeLux } from "@/components/landing/scroll-reveal";
import { motion, useReducedMotion } from "framer-motion";
import {
    GithubIcon,
    LinkedinIcon,
    ReceiptIcon,
    TwitterIcon,
} from "lucide-react";
import Link from "next/link";

const linkGroups = [
    {
        title: "Product",
        links: [
            { href: "#product", label: "Product tour" },
            { href: "#features", label: "Features" },
            { href: "/signup", label: "Get started" },
        ],
    },
    {
        title: "About",
        links: [
            { href: "#trust", label: "Why ExpenseTracker" },
            { href: "#product", label: "Dashboard preview" },
            { href: "#features", label: "What's included" },
        ],
    },
    {
        title: "Socials",
        links: [
            {
                href: "https://twitter.com",
                label: "Twitter",
            },
            {
                href: "https://linkedin.com",
                label: "LinkedIn",
            },
            {
                href: "https://github.com",
                label: "GitHub",
            },
        ],
    },
] as const;

const socialIcons = [
    { href: "https://twitter.com", label: "Twitter", Icon: TwitterIcon },
    { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinIcon },
    { href: "https://github.com", label: "GitHub", Icon: GithubIcon },
] as const;

function LandingFooter() {
    const reduceMotion = useReducedMotion();

    const columnTransition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.55, ease: easeLux };

    return (
        <motion.footer
            className="relative overflow-hidden border-t border-slate-200/60 bg-[#f8f9fa]"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: easeLux }}
        >
            {/* Schematic grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.45]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgb(15 23 42 / 0.04) 1px, transparent 1px),
                        linear-gradient(to bottom, rgb(15 23 42 / 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: "56px 56px",
                }}
                aria-hidden
            />
            {/* Accent arcs */}
            <div
                className="pointer-events-none absolute -right-32 top-0 size-[420px] rounded-full border border-slate-300/20"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -right-20 top-24 size-[280px] rounded-full border border-slate-300/15"
                aria-hidden
            />

            {/* Watermark */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
                aria-hidden
            >
                <span className="translate-y-[28%] select-none text-[clamp(3.5rem,15vw,11rem)] font-bold tracking-tight text-slate-300/25">
                    ExpenseTracker
                </span>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-8 lg:pb-12 lg:pt-20">
                <div className="grid gap-14 md:gap-16 lg:grid-cols-12 lg:gap-12">
                    {/* Brand column */}
                    <motion.div
                        className="lg:col-span-5"
                        initial={
                            reduceMotion ? undefined : { opacity: 0, y: 22 }
                        }
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ ...columnTransition, delay: 0 }}
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-violet-600 shadow-md shadow-slate-900/10">
                                <ReceiptIcon className="size-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                ExpenseTracker
                            </span>
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-500">
                            Personal finance clarity—without the noise. Track,
                            categorize, and understand spending in one calm
                            place.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                                <span
                                    className="size-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.22)]"
                                    aria-hidden
                                />
                                All systems operational
                            </span>
                        </div>
                    </motion.div>

                    {/* Link columns */}
                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:gap-12">
                        {linkGroups.map((group, index) => (
                            <motion.div
                                key={group.title}
                                initial={
                                    reduceMotion
                                        ? undefined
                                        : { opacity: 0, y: 22 }
                                }
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{
                                    ...columnTransition,
                                    delay: reduceMotion
                                        ? 0
                                        : 0.06 * (index + 1),
                                }}
                            >
                                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    {group.title}
                                </div>
                                {group.title === "Socials" ? (
                                    <>
                                        <ul className="mt-5 hidden space-y-3 text-sm sm:block">
                                            {group.links.map((link) => (
                                                <li key={link.label}>
                                                    <a
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-slate-600 transition-colors hover:text-slate-900"
                                                    >
                                                        {link.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-5 flex gap-2 sm:hidden">
                                            {socialIcons.map(
                                                ({ href, label, Icon }) => (
                                                    <a
                                                        key={label}
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                                                        aria-label={label}
                                                    >
                                                        <Icon className="size-[18px]" />
                                                    </a>
                                                ),
                                            )}
                                        </div>
                                        <div className="mt-4 hidden gap-2 sm:flex">
                                            {socialIcons.map(
                                                ({ href, label, Icon }) => (
                                                    <a
                                                        key={label}
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                                                        aria-label={label}
                                                    >
                                                        <Icon className="size-[18px]" />
                                                    </a>
                                                ),
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <ul className="mt-5 space-y-3.5 text-sm">
                                        {group.links.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    href={link.href}
                                                    className="text-slate-600 transition-colors hover:text-slate-900"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <motion.div
                    className="mt-16 flex flex-col gap-6 border-t border-slate-200/70 pt-8 sm:flex-row sm:items-center sm:justify-between"
                    initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.5, delay: 0.12, ease: easeLux }
                    }
                >
                    <p className="order-2 text-xs text-slate-500 sm:order-1">
                        Insights are for planning only—not financial advice.
                    </p>
                    <div className="order-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 sm:order-2 sm:justify-end">
                        <span>© {new Date().getFullYear()} ExpenseTracker</span>
                        <span className="hidden h-3 w-px bg-slate-300 sm:inline" />
                        <Link
                            href="#"
                            className="transition-colors hover:text-slate-800"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="transition-colors hover:text-slate-800"
                        >
                            Terms of Use
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
}

export default LandingFooter;
