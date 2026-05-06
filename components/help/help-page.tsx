"use client";

import { useAuth } from "@/context/auth-context";
import { fetchHelpContent, submitSupportContact } from "@/lib/help";
import type { HelpCenterPayload } from "@/lib/help-content";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    BookOpenIcon,
    ChevronRightIcon,
    LifeBuoyIcon,
    MailIcon,
    MessageSquareIcon,
    SearchIcon,
    SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function EmphasisText({ text }: { text: string }) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <strong key={i} className="font-semibold text-gray-900">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}

export default function HelpPage() {
    const { user } = useAuth();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["help-center"],
        queryFn: fetchHelpContent,
    });

    const [category, setCategory] = useState("other");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [replyEmail, setReplyEmail] = useState("");
    const [honeypot, setHoneypot] = useState("");

    const defaultEmail = user?.email ?? "";

    const contactMutation = useMutation({
        mutationFn: submitSupportContact,
        onSuccess: () => {
            toast.success(
                "Message sent. We’ll get back to you as soon as we can.",
            );
            setSubject("");
            setMessage("");
            setCategory("other");
            setReplyEmail("");
            setHoneypot("");
        },
        onError: (e: Error) => {
            toast.error(e.message);
        },
    });

    const payload = data;

    const quickLinkIcon = useMemo(
        () =>
            ({
                "add-expense": BookOpenIcon,
                categories: SearchIcon,
                settings: SettingsIcon,
                recurring: MessageSquareIcon,
            }) as Record<string, typeof BookOpenIcon>,
        [],
    );

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
            </div>
        );
    }

    if (isError || !payload) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                Could not load help content. Refresh the page or try again
                later.
            </div>
        );
    }

    return (
        <HelpPageInner
            payload={payload}
            quickLinkIcon={quickLinkIcon}
            category={category}
            setCategory={setCategory}
            subject={subject}
            setSubject={setSubject}
            message={message}
            setMessage={setMessage}
            replyEmail={replyEmail}
            setReplyEmail={setReplyEmail}
            honeypot={honeypot}
            setHoneypot={setHoneypot}
            defaultEmail={defaultEmail}
            contactPending={contactMutation.isPending}
            onSubmitContact={() => {
                const email =
                    replyEmail.trim() ||
                    (defaultEmail ? defaultEmail : undefined);
                if (!email) {
                    toast.error(
                        "Add a reply email or sign in so we can reach you.",
                    );
                    return;
                }
                contactMutation.mutate({
                    category,
                    subject: subject.trim(),
                    message: message.trim(),
                    replyEmail: email,
                    website: honeypot,
                });
            }}
        />
    );
}

function HelpPageInner({
    payload,
    quickLinkIcon,
    category,
    setCategory,
    subject,
    setSubject,
    message,
    setMessage,
    replyEmail,
    setReplyEmail,
    honeypot,
    setHoneypot,
    defaultEmail,
    contactPending,
    onSubmitContact,
}: {
    payload: HelpCenterPayload;
    quickLinkIcon: Record<string, ComponentType<{ className?: string }>>;
    category: string;
    setCategory: (v: string) => void;
    subject: string;
    setSubject: (v: string) => void;
    message: string;
    setMessage: (v: string) => void;
    replyEmail: string;
    setReplyEmail: (v: string) => void;
    honeypot: string;
    setHoneypot: (v: string) => void;
    defaultEmail: string;
    contactPending: boolean;
    onSubmitContact: () => void;
}) {
    return (
        <div className="space-y-10 pb-12">
            {/* Hero / wireframe header */}
            <header className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-violet-50/90 via-white to-white p-8 shadow-sm sm:p-10">
                <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-violet-200/30 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-8 size-48 rounded-full bg-violet-100/40 blur-3xl" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-800">
                            <LifeBuoyIcon className="size-3.5" />
                            Support hub
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            {payload.pageTitle}
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-gray-600">
                            {payload.pageSubtitle}
                        </p>
                    </div>
                    <a
                        href={`mailto:${payload.supportEmail}?subject=ExpenseTracker%20help`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
                    >
                        <MailIcon className="size-4" />
                        Email us
                    </a>
                </div>
            </header>

            {/* Quick links — wireframe cards */}
            <section>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Quick links
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {payload.quickLinks.map((link) => {
                        const Icon =
                            quickLinkIcon[link.id] ?? ChevronRightIcon;
                        return (
                            <Link
                                key={link.id}
                                href={link.href}
                                className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50/30"
                            >
                                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors group-hover:bg-violet-100 group-hover:text-violet-700">
                                    <Icon className="size-5" />
                                </div>
                                <span className="font-semibold text-gray-900">
                                    {link.title}
                                </span>
                                <span className="mt-1 text-sm text-gray-500">
                                    {link.description}
                                </span>
                                <span className="mt-3 inline-flex items-center text-xs font-semibold text-violet-600">
                                    Open
                                    <ChevronRightIcon className="ml-0.5 size-3.5" />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Topics */}
            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <BookOpenIcon className="size-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Guides
                        </h2>
                        <p className="text-xs text-gray-500">
                            Step-by-step basics for daily use.
                        </p>
                    </div>
                </div>
                <ul className="divide-y divide-gray-100">
                    {payload.topics.map((topic) => (
                        <li key={topic.id} className="px-6 py-5">
                            <h3 className="font-semibold text-gray-900">
                                {topic.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                {topic.summary}
                            </p>
                            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
                                {topic.steps.map((step, i) => (
                                    <li key={i}>
                                        <EmphasisText text={step} />
                                    </li>
                                ))}
                            </ol>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <MessageSquareIcon className="size-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            FAQ
                        </h2>
                        <p className="text-xs text-gray-500">
                            Common questions from users.
                        </p>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {payload.faqs.map((faq) => (
                        <details
                            key={faq.id}
                            className="group px-6 py-3 [&_summary::-webkit-details-marker]:hidden"
                        >
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 py-2 text-sm font-medium text-gray-900">
                                <span>{faq.question}</span>
                                <ChevronRightIcon className="size-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                            </summary>
                            <p className="pb-3 pl-0.5 text-sm leading-relaxed text-gray-600">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            {/* Contact form — wireframe panel */}
            <section
                id="contact"
                className="overflow-hidden rounded-2xl border border-dashed border-violet-200/80 bg-violet-50/20 shadow-sm"
            >
                <div className="flex flex-col gap-2 border-b border-violet-100/80 bg-violet-50/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-white text-violet-600 ring-1 ring-violet-100">
                            <MailIcon className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Contact support
                            </h2>
                            <p className="text-xs text-gray-500">
                                {payload.responseTimeNote}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid gap-8 p-6 lg:grid-cols-5">
                    <form
                        className="space-y-4 lg:col-span-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmitContact();
                        }}
                    >
                        <div className="hidden" aria-hidden="true">
                            <label htmlFor="support-website">Website</label>
                            <input
                                id="support-website"
                                name="website"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                                autoComplete="off"
                                tabIndex={-1}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="support-category"
                                className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                                Category
                            </label>
                            <select
                                id="support-category"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                            >
                                {payload.contactCategories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="support-subject"
                                className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                                Subject
                            </label>
                            <input
                                id="support-subject"
                                type="text"
                                required
                                minLength={3}
                                maxLength={200}
                                value={subject}
                                onChange={(e) =>
                                    setSubject(e.target.value)
                                }
                                placeholder="Short summary of your request"
                                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="support-message"
                                className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                                Message
                            </label>
                            <textarea
                                id="support-message"
                                required
                                minLength={20}
                                maxLength={5000}
                                rows={6}
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                placeholder="What happened? What did you expect? Include steps to reproduce for bugs."
                                className="mt-2 w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Minimum 20 characters.
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="support-reply-email"
                                className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                                Reply email
                            </label>
                            <input
                                id="support-reply-email"
                                type="email"
                                value={
                                    replyEmail ||
                                    (defaultEmail ? defaultEmail : "")
                                }
                                onChange={(e) =>
                                    setReplyEmail(e.target.value)
                                }
                                placeholder={
                                    defaultEmail || "you@example.com"
                                }
                                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                            />
                            {defaultEmail ? (
                                <p className="mt-1 text-xs text-gray-400">
                                    Pre-filled from your account. You can
                                    change it for this message only.
                                </p>
                            ) : (
                                <p className="mt-1 text-xs text-gray-400">
                                    Required so we can reply.
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={contactPending}
                            className={cn(
                                "rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:opacity-60",
                            )}
                        >
                            {contactPending ? "Sending…" : "Send message"}
                        </button>
                    </form>

                    <aside className="rounded-xl border border-gray-200/80 bg-white p-5 text-sm text-gray-600 lg:col-span-2">
                        <p className="font-semibold text-gray-900">
                            Prefer email?
                        </p>
                        <p className="mt-2">
                            Reach us directly at{" "}
                            <a
                                href={`mailto:${payload.supportEmail}`}
                                className="font-medium text-violet-600 hover:underline"
                            >
                                {payload.supportEmail}
                            </a>
                            .
                        </p>
                        <p className="mt-4 text-xs text-gray-400">
                            Reference IDs are returned after you submit the
                            form—include them in follow-ups if you email us
                            separately.
                        </p>
                    </aside>
                </div>
            </section>
        </div>
    );
}
