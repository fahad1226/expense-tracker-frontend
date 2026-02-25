import CategoryList from "@/components/categories/category-list";
import ApplicationSidebar from "@/components/sidebar/sidebar";
import { apiServer, AUTH_TOKEN_KEY } from "@/config/api.server";
import { cookies } from "next/headers";

export default async function CategoriesPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(AUTH_TOKEN_KEY);

    const { data } = await apiServer(authToken?.value).get("/categories");

    return (
        <ApplicationSidebar>
            <CategoryList categories={data.categories} />
        </ApplicationSidebar>
    );
}
