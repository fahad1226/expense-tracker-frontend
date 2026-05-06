import RecurringExpenseForm from "@/components/recurring/recurring-expense-form";
import ApplicationSidebar from "@/components/sidebar/sidebar";
import { apiServer, AUTH_TOKEN_KEY } from "@/config/api.server";
import { mapRecurringDetail } from "@/lib/recurring-expenses";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditRecurringPage({ params }: Props) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;
    const { data: catData } = await apiServer(token).get("/categories");
    const categories = catData.categories ?? [];

    let row = null;
    try {
        const { data } = await apiServer(token).get(
            `/recurring-expenses/${id}`,
        );
        row = mapRecurringDetail(data, categories);
    } catch {
        notFound();
    }

    if (!row) {
        notFound();
    }

    return (
        <ApplicationSidebar>
            <RecurringExpenseForm
                mode="edit"
                recurringId={id}
                categories={categories}
                initial={{
                    amount: row.amount,
                    note: row.note,
                    category_id: row.categoryId,
                    frequency: row.frequency,
                    start_date: row.startDate,
                    end_date: row.endDate,
                    is_active: row.isActive,
                }}
            />
        </ApplicationSidebar>
    );
}
