"use client";

import {
  DollarSignIcon,
  ReceiptIcon,
  TrendingDownIcon,
} from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/expenses";
import type { Expense } from "@/lib/expenses";

interface DashboardSummaryCardsProps {
  expenses: Expense[];
}

function getCurrentMonthExpenses(expenses: Expense[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.filter((e) => {
    const date = new Date(e.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
}

export function DashboardSummaryCards({ expenses }: DashboardSummaryCardsProps) {
  const monthExpenses = getCurrentMonthExpenses(expenses);
  const monthlyTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  const dailyAverage = daysInMonth > 0 ? monthlyTotal / daysInMonth : 0;

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>This Month</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(monthlyTotal)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <DollarSignIcon className="size-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            Total expenses for {new Date().toLocaleString("default", { month: "long" })}
          </p>
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Daily Average</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(dailyAverage)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <TrendingDownIcon className="size-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            Based on {daysInMonth} days this month
          </p>
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Transactions</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {monthExpenses.length}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <ReceiptIcon className="size-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            Expenses recorded this month
          </p>
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Tracked</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <DollarSignIcon className="size-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Link
            href="/expenses/list"
            className="text-sm text-primary hover:underline"
          >
            View all expenses →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
