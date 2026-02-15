import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSummaryCards } from "@/features/dashboard/dashboard-summary-cards";
import { ExpenseCategoryChart } from "@/features/dashboard/expense-category-chart";
import { RecentExpenses } from "@/features/dashboard/recent-expenses";
import { mockExpenses } from "@/lib/expenses";

export default function DashboardPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />

            <SiteHeader title="Dashboard" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <DashboardSummaryCards expenses={mockExpenses} />
                        <div className="px-4 lg:px-6">
                            <ExpenseCategoryChart expenses={mockExpenses} />
                        </div>
                        <div className="px-4 lg:px-6">
                            <RecentExpenses expenses={mockExpenses} />
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
