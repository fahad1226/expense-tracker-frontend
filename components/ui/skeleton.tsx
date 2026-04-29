import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Optional: use "pulse" for a softer effect instead of shimmer */
    variant?: "shimmer" | "pulse";
}

/**
 * Premium skeleton component with smooth shimmer animation.
 * Use for loading states that match content layout.
 */
function Skeleton({ className, variant = "shimmer", ...props }: SkeletonProps) {
    return (
        <div
            data-skeleton
            className={cn(
                "rounded-lg",
                variant === "shimmer" && [
                    "relative overflow-hidden skeleton-shimmer",
                    "bg-linear-to-r from-gray-200 via-gray-100 to-gray-200",
                    "bg-size-[200%_100%]",
                ],
                variant === "pulse" && "animate-pulse bg-gray-200",
                className,
            )}
            {...props}
        />
    );
}

function SummaryCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm shadow-gray-200/50">
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="size-11 shrink-0 rounded-xl" />
            </div>
        </div>
    );
}

function ChartCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-200/50">
            <div className="border-b border-gray-100 bg-gray-50/30 px-6 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-16 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="flex h-[280px] items-end justify-around gap-2 p-6 pt-4">
                {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                    <Skeleton
                        key={i}
                        className="w-full flex-1 rounded-t"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

function TableRowSkeleton() {
    return (
        <div className="flex items-center gap-4 border-b border-gray-50 py-4 last:border-0">
            <Skeleton className="size-4 shrink-0 rounded" />
            <div className="flex flex-1 items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-lg" />
                <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
        </div>
    );
}

export { ChartCardSkeleton, Skeleton, SummaryCardSkeleton, TableRowSkeleton };
