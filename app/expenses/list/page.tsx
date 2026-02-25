import ExpenseList from "@/components/expenses/expense-list";
import ApplicationSidebar from "@/components/sidebar/sidebar";
import { apiServer, AUTH_TOKEN_KEY } from "@/config/api.server";
import { cookies } from "next/headers";

export default async function ExpensesListPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(AUTH_TOKEN_KEY);

    const { data } = await apiServer(authToken?.value).get("/expenses");

    console.log("expenses data from server is", data);

    return (
        <ApplicationSidebar>
            <ExpenseList expenses={data.data} />
        </ApplicationSidebar>
    );
}
