import ApplicationSidebar from "@/components/sidebar/sidebar";
import {
    ChartCardSkeleton,
    Skeleton,
    SummaryCardSkeleton,
    TableRowSkeleton,
} from "@/components/ui/skeleton";

function loading() {
    return (
        <div>
            <ApplicationSidebar>
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Skeleton className="h-10 w-[140px] rounded-lg" />
                            <Skeleton className="h-10 w-24 rounded-lg" />
                            <Skeleton className="h-10 w-24 rounded-lg" />
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <SummaryCardSkeleton key={i} />
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <ChartCardSkeleton />
                        <ChartCardSkeleton />
                    </div>

                    {/* Recent Expenses Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
                        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-6 py-4">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-4 w-16 rounded" />
                        </div>
                        <div className="p-6">
                            {/* Table header */}
                            <div className="mb-4 flex gap-4 border-b border-gray-100 pb-3">
                                <Skeleton className="h-4 w-8 shrink-0" />
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            {/* Table rows */}
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <TableRowSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </ApplicationSidebar>
        </div>
    );
}
export default loading;
