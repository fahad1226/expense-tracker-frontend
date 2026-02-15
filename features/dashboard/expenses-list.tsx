
import {
    IconBell,
    IconChartBar,
    IconCurrencyDollar,
    IconPlus,
    IconTrendingDown
} from "@tabler/icons-react";
import Link from "next/link";

function ExpensesList() {
    return (
        <>
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Welcome back! Here&apos;s your financial overview.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <IconBell className="h-5 w-5" strokeWidth={2} />
                            </button>
                            <Link
                                href="/expenses/new"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-105"
                            >
                                <IconPlus className="h-4 w-4" strokeWidth={2.5} />
                                Add Expense
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total This Month */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <IconCurrencyDollar className="h-5 w-5 text-blue-600" strokeWidth={2} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">$2,450</p>
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <IconTrendingDown className="h-3 w-3" strokeWidth={2.5} />
                                12% from last month
                            </p>
                        </div>

                        {/* Average Daily */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-500">Daily Average</h3>
                                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <IconChartBar className="h-5 w-5 text-indigo-600" strokeWidth={2} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">$81</p>
                            <p className="text-xs text-gray-500">Based on 30 days</p>
                        </div>

                        {/* Categories */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                                <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                    <IconChartBar className="h-5 w-5 text-purple-600" strokeWidth={2} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">8</p>
                            <p className="text-xs text-gray-500">Active categories</p>
                        </div>

                        {/* Total Expenses */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                                <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                                    <IconCurrencyDollar className="h-5 w-5 text-green-600" strokeWidth={2} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">127</p>
                            <p className="text-xs text-gray-500">This month</p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Expenses */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
                                    <Link
                                        href="/expenses"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        View all
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {[
                                        { name: "Grocery Shopping", category: "Food", amount: "$125.50", date: "Today" },
                                        { name: "Uber Ride", category: "Transport", amount: "$24.00", date: "Today" },
                                        { name: "Netflix Subscription", category: "Entertainment", amount: "$15.99", date: "Yesterday" },
                                        { name: "Coffee", category: "Food", amount: "$5.50", date: "Yesterday" },
                                        { name: "Book Purchase", category: "Shopping", amount: "$32.99", date: "2 days ago" },
                                    ].map((expense, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {expense.category[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{expense.name}</p>
                                                    <p className="text-sm text-gray-500">{expense.category} • {expense.date}</p>
                                                </div>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">{expense.amount}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {[
                                        { name: "Food", amount: "$850", percentage: 35, color: "bg-blue-500" },
                                        { name: "Transport", amount: "$420", percentage: 17, color: "bg-indigo-500" },
                                        { name: "Shopping", amount: "$380", percentage: 15, color: "bg-purple-500" },
                                        { name: "Entertainment", amount: "$280", percentage: 11, color: "bg-pink-500" },
                                        { name: "Bills", amount: "$520", percentage: 21, color: "bg-green-500" },
                                    ].map((category, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-gray-700">{category.name}</span>
                                                <span className="font-semibold text-gray-900">{category.amount}</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${category.color} rounded-full transition-all`}
                                                    style={{ width: `${category.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default ExpensesList