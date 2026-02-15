import { DollarSignIcon, ReceiptIcon } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ExpensesTable } from "@/features/expenses/expenses-table";
import { mockExpenses, formatCurrency } from "@/lib/expenses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExpensesListPage() {
  const totalAmount = mockExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SiteHeader title="Expenses" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex flex-col gap-2 px-4 lg:px-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                All Expenses
              </h2>
              <p className="text-muted-foreground">
                View and manage your expense history
              </p>
            </div>
            <div className="grid gap-4 px-4 lg:px-6 sm:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>Total Tracked</CardDescription>
                  <DollarSignIcon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {formatCurrency(totalAmount)}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all categories
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>Expense Count</CardDescription>
                  <ReceiptIcon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {mockExpenses.length}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recorded expenses
                  </p>
                </CardContent>
              </Card>
            </div>
            <ExpensesTable data={mockExpenses} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
