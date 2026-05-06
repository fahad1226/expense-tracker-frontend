import RecurringExpenseList from "@/components/recurring/recurring-list";
import ApplicationSidebar from "@/components/sidebar/sidebar";
import { apiServer, AUTH_TOKEN_KEY } from "@/config/api.server";
import { mapRecurringListResponse } from "@/lib/recurring-expenses";
import { cookies } from "next/headers";

export default async function RecurringPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;

    const { data: catData } = await apiServer(token).get("/categories");
    const categories = catData.categories ?? [];

    let raw: unknown = { data: [] };
    try {
        const { data } = await apiServer(token).get("/recurring-expenses");
        raw = data;
    } catch {
        // Backend may not implement this route yet; show empty list + setup hint.
    }

    const items = mapRecurringListResponse(raw, categories);

    return (
        <ApplicationSidebar>
            <RecurringExpenseList items={items} />
        </ApplicationSidebar>
    );
}
