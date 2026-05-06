/** Single source of truth for Help & Support — served via GET /api/help */

export type HelpQuickLink = {
    id: string;
    title: string;
    description: string;
    href: string;
};

export type HelpTopic = {
    id: string;
    title: string;
    summary: string;
    steps: string[];
};

export type HelpFaqItem = {
    id: string;
    question: string;
    answer: string;
};

export type HelpContactCategory = {
    id: string;
    label: string;
};

export type HelpCenterPayload = {
    version: number;
    pageTitle: string;
    pageSubtitle: string;
    supportEmail: string;
    responseTimeNote: string;
    quickLinks: HelpQuickLink[];
    topics: HelpTopic[];
    faqs: HelpFaqItem[];
    contactCategories: HelpContactCategory[];
};

export const HELP_CENTER_PAYLOAD: HelpCenterPayload = {
    version: 1,
    pageTitle: "Help & Support",
    pageSubtitle:
        "Get started with ExpenseTracker, fix common issues, or reach the team.",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@expensetracker.app",
    responseTimeNote:
        "We typically reply within 1–2 business days. Include steps to reproduce for bugs.",
    quickLinks: [
        {
            id: "add-expense",
            title: "Add an expense",
            description: "Open the form and record a transaction in seconds.",
            href: "/expenses/new",
        },
        {
            id: "categories",
            title: "Manage categories",
            description: "Organize spending with custom categories.",
            href: "/categories",
        },
        {
            id: "settings",
            title: "Account & currency",
            description: "Name, password, and display currency (e.g. BDT).",
            href: "/settings",
        },
        {
            id: "recurring",
            title: "Recurring expenses",
            description: "Automate subscriptions and regular bills.",
            href: "/recurring",
        },
    ],
    topics: [
        {
            id: "first-run",
            title: "First 5 minutes",
            summary: "The fastest path from empty account to useful insights.",
            steps: [
                "Sign in and open **Settings** to confirm your name and currency.",
                "Create a few **Categories** that match how you spend (Food, Transport, etc.).",
                "Add **expenses** with amount, date, and category.",
                "Open **Dashboard** or **Reports** to see totals by period and category.",
            ],
        },
        {
            id: "currency",
            title: "Currency & amounts",
            summary: "How display currency works across the app.",
            steps: [
                "Default display currency is **Bangladeshi Taka (BDT)** until you change it in **Settings**.",
                "Formatting uses your chosen currency for labels; enter amounts as you normally would.",
                "If numbers look unexpected, verify **Settings → Currency** matches what you expect.",
            ],
        },
        {
            id: "account",
            title: "Account security",
            summary: "Password and profile without changing email in-app.",
            steps: [
                "Update your **name** or **password** under **Settings → Account**.",
                "Email cannot be changed in the app for security—contact support if you need an update.",
                "Use a strong, unique password and sign out on shared devices.",
            ],
        },
    ],
    faqs: [
        {
            id: "faq-delete-expense",
            question: "How do I edit or remove an expense?",
            answer: "Open **Expenses** from the sidebar, find the entry in the list, and use the row actions to edit or delete. Deleted expenses are removed from totals immediately.",
        },
        {
            id: "faq-recurring",
            question: "What happens with recurring expenses?",
            answer: "Recurring items represent bills or subscriptions on a schedule. They appear in your recurring list and help you plan; exact posting rules depend on your workspace configuration.",
        },
        {
            id: "faq-budgets",
            question: "Are budgets required?",
            answer: "No. Budgets are optional. You can track spending with categories and expense entries alone, then add budgets when you want limits per category or period.",
        },
        {
            id: "faq-export",
            question: "Can I export my data?",
            answer: "Full export may be added after MVP. For now, use **Reports** for snapshots; contact support if you need a manual export.",
        },
        {
            id: "faq-login",
            question: "Why was I signed out?",
            answer: "You may have been inactive for a while, signed out on purpose, or opened the app in another browser or device. Always use the same web address you used when you signed in. If it keeps happening, try signing in again or contact support.",
        },
    ],
    contactCategories: [
        { id: "bug", label: "Bug report" },
        { id: "account", label: "Account & login" },
        { id: "billing", label: "Billing (future)" },
        { id: "feature", label: "Feature request" },
        { id: "other", label: "Other" },
    ],
};
