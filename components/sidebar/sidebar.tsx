"use client";

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    TransitionChild,
} from "@headlessui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { UserAvatar } from "@/components/user/user-avatar";
import { useAuth } from "@/context/auth-context";
import clsx from "clsx";
import {
    BarChart3Icon,
    BellIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    MenuIcon,
    PiggyBankIcon,
    ReceiptIcon,
    RepeatIcon,
    SearchIcon,
    SettingsIcon,
    TagIcon,
    XIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const generalNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    {
        name: "Expenses",
        href: "/expenses/list",
        icon: ReceiptIcon,
        activeMatch: "/expenses",
    },
    {
        name: "Recurring",
        href: "/recurring",
        icon: RepeatIcon,
        activeMatch: "/recurring",
    },
    { name: "Categories", href: "/categories", icon: TagIcon },
    { name: "Reports", href: "/reports", icon: BarChart3Icon },
];

const toolsNav = [
    { name: "Analytics", href: "/analytics", icon: BarChart3Icon },
    { name: "Budgets", href: "/budgets", icon: PiggyBankIcon, badge: "BETA" },
];

const supportNav = [
    { name: "Settings", href: "/settings", icon: SettingsIcon },
    { name: "Help", href: "/help", icon: HelpCircleIcon },
];

function NavSection({
    title,
    items,
}: {
    title: string;
    items: Array<{
        name: string;
        href: string;
        icon: React.ComponentType<{ className?: string }>;
        badge?: string | number | null;
        activeMatch?: string;
    }>;
}) {
    const pathname = usePathname();

    return (
        <div className="mb-6">
            <h3 className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {title}!
            </h3>
            <ul className="space-y-0.5">
                {items.map((item) => {
                    const isActive = item.activeMatch
                        ? pathname.startsWith(item.activeMatch)
                        : pathname === item.href;
                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={clsx(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-violet-100 text-gray-900"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                )}
                            >
                                <item.icon
                                    className={clsx(
                                        "size-5 shrink-0",
                                        isActive
                                            ? "text-violet-600"
                                            : "text-gray-500 group-hover:text-gray-700",
                                    )}
                                />
                                <span className="flex-1">{item.name}</span>
                                {item.badge && (
                                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default function ApplicationSidebar({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const { user, isLoading, logout: authLogout } = useAuth();

    const sidebarWidth = sidebarCollapsed ? "lg:w-20" : "lg:w-64";

    const handleLogout = async () => {
        try {
            await authLogout();
            router.push("/login");
        } catch (error) {
            console.error(error);
            toast.error("Failed to logout");
        }
    };

    return (
        <>
            <div>
                {/* Mobile dialog */}
                <Dialog
                    open={sidebarOpen}
                    onClose={setSidebarOpen}
                    className="relative z-50 lg:hidden"
                >
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/50 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                    />

                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                        >
                            <TransitionChild>
                                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                    <button
                                        type="button"
                                        onClick={() => setSidebarOpen(false)}
                                        className="-m-2.5 p-2.5"
                                    >
                                        <span className="sr-only">
                                            Close sidebar
                                        </span>
                                        <XIcon
                                            aria-hidden="true"
                                            className="size-6 text-gray-600"
                                        />
                                    </button>
                                </div>
                            </TransitionChild>

                            <div className="relative flex grow flex-col overflow-y-auto bg-gray-50 px-4 pb-4">
                                <div className="flex h-16 shrink-0 items-center border-b border-gray-200/70 pb-3">
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setSidebarOpen(false)}
                                        className="group -mx-1 flex w-full items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-100/90"
                                    >
                                        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/70">
                                            <Image
                                                src="/logo.png"
                                                alt=""
                                                width={40}
                                                height={40}
                                                className="size-7 object-contain"
                                                aria-hidden
                                            />
                                        </span>
                                        <span className="flex min-w-0 flex-col justify-center leading-none">
                                            <span className="truncate text-[15px] font-semibold tracking-tight">
                                                <span className="text-violet-600">
                                                    Expense
                                                </span>{" "}
                                                <span className="text-gray-900">
                                                    Tracker
                                                </span>
                                            </span>
                                        </span>
                                    </Link>
                                </div>
                                <nav className="flex flex-1 flex-col pt-6">
                                    <NavSection
                                        title="General"
                                        items={generalNav}
                                    />
                                    <NavSection
                                        title="Tools"
                                        items={toolsNav}
                                    />
                                    <NavSection
                                        title="Support"
                                        items={supportNav}
                                    />
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Desktop sidebar */}
                <div
                    className={clsx(
                        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-50",
                        sidebarWidth,
                    )}
                >
                    <div className="flex grow flex-col overflow-y-auto px-4 pb-4">
                        <div
                            className={clsx(
                                "flex shrink-0 border-b border-gray-200/70 pb-3",
                                sidebarCollapsed
                                    ? "justify-center pt-3"
                                    : "items-center pt-2",
                            )}
                        >
                            <Link
                                href="/dashboard"
                                title="Expense Tracker"
                                className={clsx(
                                    "rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50",
                                    sidebarCollapsed
                                        ? "flex size-11 items-center justify-center hover:bg-gray-100/90"
                                        : "flex w-full items-center gap-3 px-2 py-1.5 hover:bg-gray-100/90",
                                )}
                            >
                                <span
                                    className={clsx(
                                        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/70",
                                        sidebarCollapsed ? "size-9" : "size-10",
                                    )}
                                >
                                    <Image
                                        src="/logo.png"
                                        alt={
                                            sidebarCollapsed
                                                ? "Expense Tracker"
                                                : ""
                                        }
                                        width={40}
                                        height={40}
                                        className={clsx(
                                            "object-contain",
                                            sidebarCollapsed
                                                ? "size-6"
                                                : "size-7",
                                        )}
                                        aria-hidden={!sidebarCollapsed}
                                    />
                                </span>
                                {!sidebarCollapsed && (
                                    <span className="flex min-w-0 flex-col justify-center leading-none">
                                        <span className="truncate text-[15px] font-semibold tracking-tight">
                                            <span className="text-violet-600">
                                                Expense
                                            </span>{" "}
                                            <span className="text-gray-900">
                                                Tracker
                                            </span>
                                        </span>
                                    </span>
                                )}
                            </Link>
                        </div>

                        <nav className="flex flex-1 flex-col pt-5">
                            {!sidebarCollapsed ? (
                                <>
                                    <NavSection
                                        title="General"
                                        items={generalNav}
                                    />
                                    <NavSection
                                        title="Tools"
                                        items={toolsNav}
                                    />
                                    <NavSection
                                        title="Support"
                                        items={supportNav}
                                    />
                                </>
                            ) : (
                                <div className="space-y-1">
                                    {[
                                        ...generalNav,
                                        ...toolsNav,
                                        ...supportNav,
                                    ].map((item) => {
                                        const prefix =
                                            "activeMatch" in item &&
                                            typeof item.activeMatch === "string"
                                                ? item.activeMatch
                                                : null;
                                        const isActive = prefix
                                            ? pathname.startsWith(prefix)
                                            : pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                title={item.name}
                                                className={clsx(
                                                    "flex justify-center rounded-lg p-2.5",
                                                    isActive
                                                        ? "bg-violet-100 text-violet-600"
                                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                                                )}
                                            >
                                                <item.icon className="size-5" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </nav>
                    </div>
                </div>

                {/* Main content area */}
                <div
                    className={clsx(
                        "w-full transition-[margin] duration-200",
                        sidebarCollapsed ? "lg:pl-20" : "lg:pl-64",
                    )}
                >
                    <div className="sticky top-0 z-40 flex h-16 items-center gap-x-3 border-b border-gray-200 bg-white px-4 sm:gap-x-4 sm:px-6">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="-m-2.5 p-2.5 text-gray-500 hover:text-gray-700 lg:hidden"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuIcon aria-hidden="true" className="size-6" />
                        </button>

                        <div
                            aria-hidden="true"
                            className="h-6 w-px bg-gray-200 lg:hidden"
                        />

                        <div className="flex min-w-0 flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
                            <div className="flex min-w-0 shrink-0 items-center gap-2">
                                <form
                                    action="#"
                                    method="GET"
                                    className="relative"
                                >
                                    <SearchIcon
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        name="search"
                                        placeholder="Search"
                                        aria-label="Search"
                                        className="w-44 rounded-xl border-0 bg-gray-100 py-2 pl-10 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500/20 sm:w-56 lg:w-64"
                                    />
                                </form>
                                <kbd className="hidden shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-500 sm:block">
                                    ⌘F
                                </kbd>
                            </div>

                            <div
                                className="min-w-0 flex-1"
                                aria-hidden="true"
                            />

                            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    className="-m-2 rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                >
                                    <span className="sr-only">
                                        View notifications
                                    </span>
                                    <BellIcon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </button>

                                <div
                                    aria-hidden="true"
                                    className="hidden h-8 w-px bg-gray-200 sm:block"
                                />

                                {isLoading ? (
                                    <div
                                        className="size-9 shrink-0 animate-pulse rounded-full bg-gray-200"
                                        aria-hidden
                                    />
                                ) : user ? (
                                    <>
                                        <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-gray-200/80 bg-gray-50/80 py-1 pl-1 pr-2 shadow-sm">
                                            <UserAvatar
                                                name={user.name}
                                                avatarUrl={user.avatar_url}
                                                size="md"
                                            />
                                            <span className="hidden max-w-[9rem] truncate text-sm font-semibold text-gray-900 md:block">
                                                {user.name}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => void handleLogout()}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-900"
                                        >
                                            <LogOutIcon className="size-4 shrink-0 text-gray-500" />
                                            <span className="hidden sm:inline">
                                                Log out
                                            </span>
                                        </button>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <main className="py-10">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
