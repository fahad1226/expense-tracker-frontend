"use client";

import {
    ArrowLeftIcon,
    CalendarIcon,
    CheckIcon,
    DollarSignIcon,
    FileTextIcon,
    Loader2Icon,
    TagIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { expenseCategories } from "@/lib/expenses";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

export default function CreateExpenseForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [date, setDate] = useState<Date | undefined>(() => new Date());
    const [formData, setFormData] = useState({
        amount: "",
        category: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.category || !date) return;
        setIsSubmitting(true);

        const payload = {
            ...formData,
            date: format(date, "yyyy-MM-dd"),
        };
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Expense data:", payload);

        setIsSubmitting(false);
        router.push("/expenses/list");
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col gap-6 px-4 lg:px-6">
            <div className="flex flex-col gap-2">
                <Link
                    href="/expenses/list"
                    className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Expenses
                </Link>
                <h2 className="text-2xl font-semibold tracking-tight">
                    Add New Expense
                </h2>
                <p className="text-muted-foreground">
                    Track your spending and stay on top of your finances
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Expense Details</CardTitle>
                        <CardDescription>
                            Fill in the details below to add a new expense to
                            your tracker
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="amount"
                                        className="flex items-center gap-2"
                                    >
                                        <DollarSignIcon className="size-4 text-muted-foreground" />
                                        Amount
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            $
                                        </span>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required
                                            className="pl-8 tabular-nums"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Enter the amount you spent
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="date-picker"
                                        className="flex items-center gap-2"
                                    >
                                        <CalendarIcon className="size-4 text-muted-foreground" />
                                        Date
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date-picker"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date &&
                                                        "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 size-4" />
                                                {date ? (
                                                    format(date, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(d) =>
                                                    d && setDate(d)
                                                }
                                                className="rounded-lg border"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-xs text-muted-foreground">
                                        When did this expense occur?
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="category"
                                    className="flex items-center gap-2"
                                >
                                    <TagIcon className="size-4 text-muted-foreground" />
                                    Category
                                </Label>
                                <Select
                                    value={formData.category || undefined}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="z-40 bg-white">
                                        {expenseCategories.map((category) => (
                                            <SelectItem
                                                key={category.value}
                                                value={category.value}
                                            >
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Choose the category that best fits this
                                    expense
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="flex items-center gap-2"
                                >
                                    <FileTextIcon className="size-4 text-muted-foreground" />
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Add a note about this expense (optional)"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="resize-none"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Add any additional details or notes
                                </p>
                            </div>

                            <Separator />

                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2Icon className="size-4 animate-spin" />
                                            Adding Expense...
                                        </>
                                    ) : (
                                        <>
                                            <CheckIcon className="size-4" />
                                            Add Expense
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="text-base">Quick Tips</CardTitle>
                        <CardDescription>
                            Get the most out of your expense tracking
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex gap-3">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                                <span>
                                    Be consistent with categories to get better
                                    insights
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                                <span>
                                    Add descriptions to remember what the
                                    expense was for
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                                <span>
                                    Record expenses as soon as possible for
                                    accuracy
                                </span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
