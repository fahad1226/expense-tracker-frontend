"use client";

import { apiClient } from "@/config/api.client";
import {
    CATEGORY_ICON_OPTIONS,
    DEFAULT_CATEGORY_ICON_ID,
} from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CategoryModal({
    openModal,
    onClose,
    onSavedSuccessfully,
}: {
    openModal: boolean;
    onClose: () => void;
    onSavedSuccessfully: () => void;
}) {
    const router = useRouter();
    const [addName, setAddName] = useState("");
    const [addDescription, setAddDescription] = useState("");
    const [addIconId, setAddIconId] = useState(DEFAULT_CATEGORY_ICON_ID);

    const createCategoryMutation = useMutation({
        mutationFn: (payload: {
            name: string;
            description: string;
            icon: string;
        }) => apiClient().post("/categories", payload),
        onSuccess: () => {
            toast.success("Category added successfully");
            onClose();
            setAddName("");
            setAddDescription("");
            setAddIconId(DEFAULT_CATEGORY_ICON_ID);
            router.refresh();
            onSavedSuccessfully();
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            const message =
                error.response?.data?.message ?? "Could not create category";
            toast.error(message);
        },
    });

    return (
        <>
            <Dialog
                open={openModal}
                onClose={() => {
                    onClose();
                }}
                className="relative z-50"
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 transition-opacity duration-200 data-closed:opacity-0"
                />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl transition duration-200 data-closed:scale-95 data-closed:opacity-0"
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Add category
                            </h2>
                            <button
                                type="button"
                                onClick={() => onClose()}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                aria-label="Close"
                            >
                                <XIcon className="size-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const name = addName.trim();
                                if (!name || createCategoryMutation.isPending) {
                                    return;
                                }
                                createCategoryMutation.mutate({
                                    name,
                                    description: addDescription.trim(),
                                    icon: addIconId,
                                });
                            }}
                            className="space-y-5 p-6"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="category-name"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    id="category-name"
                                    type="text"
                                    placeholder="e.g. Groceries"
                                    value={addName}
                                    onChange={(e) => setAddName(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="category-description"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="category-description"
                                    placeholder="Optional description for this category"
                                    value={addDescription}
                                    onChange={(e) =>
                                        setAddDescription(e.target.value)
                                    }
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">
                                    Icon
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {CATEGORY_ICON_OPTIONS.map(
                                        ({ id, Icon, label }) => {
                                            const isSelected = addIconId === id;
                                            return (
                                                <button
                                                    key={id}
                                                    type="button"
                                                    title={label}
                                                    onClick={() =>
                                                        setAddIconId(id)
                                                    }
                                                    className={cn(
                                                        "flex size-12 items-center justify-center rounded-xl border-2 transition-all",
                                                        isSelected
                                                            ? "border-violet-500 bg-violet-50 text-violet-600"
                                                            : "border-gray-200 bg-gray-50/50 text-gray-500 hover:border-gray-300 hover:bg-gray-100",
                                                    )}
                                                >
                                                    <Icon className="size-5" />
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={() => onClose()}
                                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        !addName.trim() ||
                                        createCategoryMutation.isPending
                                    }
                                    className={cn(
                                        "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all",
                                        addName.trim() &&
                                            !createCategoryMutation.isPending
                                            ? "bg-violet-600 hover:bg-violet-700"
                                            : "cursor-not-allowed bg-gray-300",
                                    )}
                                >
                                    {createCategoryMutation.isPending ? (
                                        <>
                                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Adding…
                                        </>
                                    ) : (
                                        "Add category"
                                    )}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
