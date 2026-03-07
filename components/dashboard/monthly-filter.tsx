import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export default function MonthPicker({
    selectedMonth,
    onSelect,
}: {
    selectedMonth: string;
    onSelect: (yearMonth: string) => void;
}) {
    const [selYear, selMonth] = selectedMonth.split("-").map(Number);
    const [viewYear, setViewYear] = useState(
        selYear ?? new Date().getFullYear(),
    );

    return (
        <div className="min-w-[220px]">
            <div className="mb-3 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setViewYear((y) => y - 1)}
                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Previous year"
                >
                    <ChevronLeftIcon className="size-4" />
                </button>
                <span className="text-sm font-semibold text-gray-900">
                    {viewYear}
                </span>
                <button
                    type="button"
                    onClick={() => setViewYear((y) => y + 1)}
                    className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Next year"
                >
                    <ChevronRightIcon className="size-4" />
                </button>
            </div>
            <div className="grid grid-cols-3 gap-1">
                {MONTH_NAMES.map((name, i) => {
                    const monthNum = i + 1;
                    const ym = `${viewYear}-${String(monthNum).padStart(2, "0")}`;
                    const isSelected =
                        selYear === viewYear && (selMonth ?? 0) === monthNum;
                    return (
                        <button
                            key={ym}
                            type="button"
                            onClick={() => onSelect(ym)}
                            className={cn(
                                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isSelected
                                    ? "bg-violet-100 text-violet-700"
                                    : "text-gray-700 hover:bg-gray-100",
                            )}
                        >
                            {name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
