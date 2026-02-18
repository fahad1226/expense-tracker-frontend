import ApplicationSidebar from "@/components/sidebar/sidebar";
import Dashboard from "@/components/dashboard/dashboard";

export default function DashboardPage() {
    return (
        <>
            <ApplicationSidebar>
                <Dashboard />
            </ApplicationSidebar>
        </>
    );
}
