"use client";

import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Expense } from "@/lib/expenses";
import { formatCurrency, getCategoryLabel } from "@/lib/expenses";

interface RecentExpensesProps {
    expenses: Expense[];
    limit?: number;
}

export function RecentExpenses({ expenses, limit = 10 }: RecentExpensesProps) {
    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Recent Expenses</CardTitle>
                    <CardDescription>Your latest transactions</CardDescription>
                </div>
                <Link
                    href="/expenses/list"
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                    View all
                    <ChevronRightIcon className="size-4" />
                </Link>
            </CardHeader>
            <CardContent>
                {recentExpenses.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentExpenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>
                                            <p className="font-medium">
                                                {expense.description || "—"}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="font-normal"
                                            >
                                                {getCategoryLabel(
                                                    expense.category,
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                expense.date,
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold tabular-nums">
                                            {formatCurrency(expense.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                        <p className="text-sm text-muted-foreground">
                            No expenses yet. Add your first expense to get
                            started.
                        </p>
                        <Link
                            href="/expenses/new"
                            className="mt-4 text-sm font-medium text-primary hover:underline"
                        >
                            Add expense →
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
