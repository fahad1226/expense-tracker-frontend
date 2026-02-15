import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import CreateExpenseForm from "@/features/dashboard/create-expense";

export default function NewExpensePage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SiteHeader title="Add Expense" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <CreateExpenseForm />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
