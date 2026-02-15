"use client";

import { IconChartBar, IconCurrencyDollar, IconHome, IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}


const navigation: NavItem[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: IconHome,
    },
    {
        name: "Expenses",
        href: "/expenses",
        icon: IconCurrencyDollar,
    },
    {
        name: "Analytics",
        href: "/analytics",
        icon: IconChartBar,
    },
];


function SidebarNavigation() {
    const pathname = usePathname();
    return (
        <>
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
                        <span className="text-xl font-bold text-white">$</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">ExpenseTracker</h1>
                        <p className="text-xs text-gray-500">Manage your finances</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon
                                    className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                        }`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="px-4 py-4 border-t border-gray-100 space-y-1">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <IconSettings className="h-5 w-5 text-gray-400" strokeWidth={2} />
                        <span>Settings</span>
                    </Link>
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <IconUser className="h-5 w-5 text-gray-400" strokeWidth={2} />
                        <span>Profile</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <IconLogout className="h-5 w-5 text-gray-400" strokeWidth={2} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

export default SidebarNavigation