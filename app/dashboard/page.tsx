import Dashboard from "@/components/dashboard/dashboard";
import ApplicationSidebar from "@/components/sidebar/sidebar";
import { apiServer, AUTH_TOKEN_KEY } from "@/config/api.server";
import { Expense } from "@/lib/expenses";
import { cookies } from "next/headers";

type DashboardResponse = {
    expenses: Expense[];
    totalExpenses: number;
    totalCategories: number;
    totalExpensesThisMonth: number;
    mostExpensiveCategory: {
        totalSpent: number;
        name: string;
    };
};

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(AUTH_TOKEN_KEY);

    const now = new Date();
    const currentMonth =
        now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

    const { data } = await apiServer(authToken?.value).get<DashboardResponse>(
        "/dashboard",
        {
            params: {
                month: currentMonth,
            },
        },
    );

    return (
        <>
            <ApplicationSidebar>
                <Dashboard data={data} />
            </ApplicationSidebar>
        </>
    );
}
