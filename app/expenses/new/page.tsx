import CreateExpenseForm from "@/components/expenses/create-expense-form";
import ApplicationSidebar from "@/components/sidebar/sidebar";

export default function CreateExpensePage() {
    return (
        <ApplicationSidebar>
            <CreateExpenseForm />
        </ApplicationSidebar>
    );
}
