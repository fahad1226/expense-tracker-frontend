import ExpenseList from "@/components/expenses/expense-list";
import ApplicationSidebar from "@/components/sidebar/sidebar";
import { apiServer, AUTH_TOKEN_KEY } from "@/config/api.server";
import type { PaginatedExpensesResponse } from "@/lib/expenses";
import { cookies } from "next/headers";

export default async function ExpensesListPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(AUTH_TOKEN_KEY);

    const { data } = await apiServer(
        authToken?.value,
    ).get<PaginatedExpensesResponse>("/expenses", {
        params: { page: 1, per_page: 15 },
    });

    return (
        <ApplicationSidebar>
            <ExpenseList initialPage={data} />
        </ApplicationSidebar>
    );
}
