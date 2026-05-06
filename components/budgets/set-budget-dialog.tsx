"use client";

import { formatCurrency } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

type SetBudgetDialogProps = {
    open: boolean;
    onClose: () => void;
    monthLabel: string;
    /** Current cap, if any — seeds the input when opening */
    initialAmount: number | null;
    onSave: (amount: number) => Promise<void>;
};

export default function SetBudgetDialog({
    open,
    onClose,
    monthLabel,
    initialAmount,
    onSave,
}: SetBudgetDialogProps) {
    const labelId = useId();
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setValue(
                initialAmount != null && initialAmount > 0
                    ? String(initialAmount)
                    : "",
            );
            setError(null);
        }
    }, [open, initialAmount]);

    const submit = async () => {
        const n = Number.parseFloat(value);
        if (Number.isNaN(n) || n < 0) {
            setError("Enter a valid amount (0 or more).");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onSave(n);
            onClose();
        } catch {
            setError("Could not save budget.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-[1px]" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2
                                id={labelId}
                                className="text-lg font-semibold text-gray-900"
                            >
                                Monthly budget
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {monthLabel}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            aria-label="Close"
                        >
                            <XIcon className="size-5" />
                        </button>
                    </div>

                    <div className="mt-6">
                        <label
                            htmlFor={`${labelId}-amount`}
                            className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                        >
                            Budget cap
                        </label>
                        <div className="mt-2 flex rounded-xl border border-gray-200 shadow-sm focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400">
                            <span className="flex items-center pl-3 text-gray-500">
                                $
                            </span>
                            <input
                                id={`${labelId}-amount`}
                                type="number"
                                min={0}
                                step="0.01"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full rounded-xl border-0 bg-transparent py-3 pr-3 text-gray-900 outline-none"
                                placeholder="0.00"
                                aria-labelledby={labelId}
                            />
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="mt-6 flex gap-2">
                        <button
                            type="button"
                            onClick={() => void submit()}
                            disabled={saving}
                            className={cn(
                                "flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:opacity-60",
                            )}
                        >
                            {saving ? "Saving…" : "Save budget"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
