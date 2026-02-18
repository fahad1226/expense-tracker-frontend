"use client";

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
} from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import clsx from "clsx";
import {
    ArrowLeftIcon,
    BarChart3Icon,
    BellIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    MenuIcon,
    PiggyBankIcon,
    ReceiptIcon,
    SearchIcon,
    SettingsIcon,
    TagIcon,
    WalletIcon,
    XIcon,
} from "lucide-react";

const generalNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    {
        name: "Expenses",
        href: "/expenses/list",
        icon: ReceiptIcon,
        activeMatch: "/expenses",
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

const teams = [
    { id: 1, name: "Personal", initial: "P", color: "bg-teal-500" },
    { id: 2, name: "Family", initial: "F", color: "bg-indigo-500" },
];

const userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
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
                {title}
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
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedTeam] = useState(teams[0]);

    const sidebarWidth = sidebarCollapsed ? "lg:w-20" : "lg:w-64";

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
                                {/* Mobile sidebar content - same as desktop */}
                                <div className="flex h-16 shrink-0 items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-violet-600 text-white">
                                            <span className="text-lg font-bold">
                                                E
                                            </span>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">
                                            ExpenseTracker
                                        </span>
                                    </div>
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
                                    <div className="mt-auto space-y-4 pt-6">
                                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-8 items-center justify-center rounded-md bg-teal-100 text-teal-600">
                                                    <WalletIcon className="size-4" />
                                                </div>
                                                <span className="flex-1 text-sm font-medium text-gray-900">
                                                    {selectedTeam.name}
                                                </span>
                                                <ChevronRightIcon className="size-4 text-gray-400" />
                                            </div>
                                        </div>
                                        <button className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Upgrade Plan
                                        </button>
                                        <p className="text-center text-xs text-gray-400">
                                            ©2025 ExpenseTracker
                                        </p>
                                    </div>
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
                        {/* Logo + Collapse */}
                        <div className="flex h-16 shrink-0 items-center justify-between">
                            <div className="flex min-w-0 items-center gap-2">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
                                    <span className="text-lg font-bold">E</span>
                                </div>
                                {!sidebarCollapsed && (
                                    <span className="truncate text-lg font-semibold text-gray-900">
                                        ExpenseTracker
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setSidebarCollapsed(!sidebarCollapsed)
                                }
                                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                                aria-label={
                                    sidebarCollapsed
                                        ? "Expand sidebar"
                                        : "Collapse sidebar"
                                }
                            >
                                <ArrowLeftIcon
                                    className={clsx(
                                        "size-4 transition-transform",
                                        sidebarCollapsed && "rotate-180",
                                    )}
                                />
                            </button>
                        </div>

                        <nav className="flex flex-1 flex-col pt-6">
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
                                        const isActive = pathname === item.href;
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

                            {/* Bottom section */}
                            <div className="mt-auto space-y-4 pt-6">
                                {!sidebarCollapsed && (
                                    <>
                                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-600">
                                                    <WalletIcon className="size-4" />
                                                </div>
                                                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
                                                    {selectedTeam.name}
                                                </span>
                                                <ChevronDownIcon className="size-4 shrink-0 text-gray-400" />
                                            </div>
                                        </div>
                                        <button className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Upgrade Plan
                                        </button>
                                        <p className="text-center text-xs text-gray-400">
                                            ©2025 ExpenseTracker
                                        </p>
                                    </>
                                )}
                            </div>
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
                    <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:gap-x-6 sm:px-6">
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

                        <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
                            <div className="flex shrink-0 items-center gap-2">
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
                                        className="w-56 rounded-lg border-0 bg-gray-100 py-2 pl-10 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 sm:w-64"
                                    />
                                </form>
                                <kbd className="hidden shrink-0 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-500 sm:block">
                                    ⌘F
                                </kbd>
                            </div>
                            <div
                                className="min-w-0 flex-1"
                                aria-hidden="true"
                            />
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <button
                                    type="button"
                                    className="-m-2.5 p-2.5 text-gray-500 hover:text-gray-700"
                                >
                                    <span className="sr-only">
                                        View notifications
                                    </span>
                                    <BellIcon
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </button>

                                <div
                                    aria-hidden="true"
                                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                                />

                                <Menu as="div" className="relative">
                                    <MenuButton className="relative flex items-center">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">
                                            Open user menu
                                        </span>
                                        <div className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 ring-2 ring-white">
                                            U
                                        </div>
                                        <span className="hidden lg:flex lg:items-center">
                                            <span
                                                aria-hidden="true"
                                                className="ml-4 text-sm font-semibold text-gray-900"
                                            >
                                                User
                                            </span>
                                            <ChevronDownIcon
                                                aria-hidden="true"
                                                className="ml-2 size-5 text-gray-400"
                                            />
                                        </span>
                                    </MenuButton>
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-200 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                    >
                                        {userNavigation.map((item) => (
                                            <MenuItem key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 data-focus:bg-gray-50 data-focus:outline-none"
                                                >
                                                    {item.name}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>
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
