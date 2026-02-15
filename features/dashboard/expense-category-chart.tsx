"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  expenseCategories,
  formatCurrency,
  getCategoryLabel,
} from "@/lib/expenses";
import type { Expense } from "@/lib/expenses";

interface ExpenseCategoryChartProps {
  expenses: Expense[];
}

function getCategoryBreakdown(expenses: Expense[]) {
  const byCategory = new Map<string, number>();

  for (const category of expenseCategories) {
    byCategory.set(category.value, 0);
  }

  for (const expense of expenses) {
    const current = byCategory.get(expense.category) ?? 0;
    byCategory.set(expense.category, current + expense.amount);
  }

  return expenseCategories
    .map((c) => ({
      category: c.value,
      label: getCategoryLabel(c.value),
      amount: byCategory.get(c.value) ?? 0,
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
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

export function ExpenseCategoryChart({ expenses }: ExpenseCategoryChartProps) {
  const [timeRange, setTimeRange] = React.useState<"month" | "all">("month");

  const filteredExpenses =
    timeRange === "month" ? getCurrentMonthExpenses(expenses) : expenses;
  const chartData = getCategoryBreakdown(filteredExpenses);

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      amount: {
        label: "Amount",
        color: "hsl(var(--chart-1))",
      },
    };
    chartData.forEach((item) => {
      config[item.category] = {
        label: item.label,
        color: "hsl(var(--chart-1))",
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          Spending by category
          {timeRange === "month"
            ? ` for ${new Date().toLocaleString("default", { month: "long" })}`
            : " (all time)"}
        </CardDescription>
        <div className="absolute right-4 top-4">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as "month" | "all")}>
            <SelectTrigger className="w-[140px]" aria-label="Select time range">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="month" className="rounded-lg">
                This month
              </SelectItem>
              <SelectItem value="all" className="rounded-lg">
                All time
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                type="category"
                dataKey="label"
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                }
              />
              <Bar
                dataKey="amount"
                fill="var(--color-amount)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground">
              No expenses to display. Add expenses to see your category breakdown.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
