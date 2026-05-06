import RecurringExpenseForm from "@/components/recurring/recurring-expense-form";
import ApplicationSidebar from "@/components/sidebar/sidebar";
import { apiServer, AUTH_TOKEN_KEY } from "@/config/api.server";
import { cookies } from "next/headers";

export default async function NewRecurringPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;
    const { data } = await apiServer(token).get("/categories");

    return (
        <ApplicationSidebar>
            <RecurringExpenseForm
                mode="create"
                categories={data.categories}
            />
        </ApplicationSidebar>
    );
}
