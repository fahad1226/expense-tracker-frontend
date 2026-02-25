import Dashboard from "@/components/dashboard/dashboard";
import ApplicationSidebar from "@/components/sidebar/sidebar";
import { apiServer, AUTH_TOKEN_KEY } from "@/config/api.server";
import { cookies } from "next/headers";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(AUTH_TOKEN_KEY);

    const { data } = await apiServer(authToken?.value).get("/expenses");

    console.log("expensed data from server is", data);

    return (
        <>
            <ApplicationSidebar>
                <Dashboard expenses={data.data} />
            </ApplicationSidebar>
        </>
    );
}
