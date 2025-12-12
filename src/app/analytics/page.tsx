"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity, Calendar } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CashFlowChart, CategoryChart } from "@/components/analytics/Charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { AnalyticsSummary } from "@/types";

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsSummary | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const result = await api.getAnalytics();
            setData(result);
        };
        loadData();
    }, []);

    if (!data) return (
        <AppShell>
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        </AppShell>
    );

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">Financial insights from your processed statements.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="this-year">
                            <SelectTrigger className="w-[180px]">
                                <Calendar className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="last-month">Last Month</SelectItem>
                                <SelectItem value="this-year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">Export Report</Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Inflow</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${data.totalInflow.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Outflow</CardTitle>
                            <TrendingDown className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${data.totalOutflow.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">+4.5% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                            <DollarSign className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${data.netCashFlow.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">+12.3% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.transactionCount}</div>
                            <p className="text-xs text-muted-foreground">{data.anomaliesCount} anomalies detected</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-3">
                    <CashFlowChart data={data.monthlyCashFlow} />
                    <CategoryChart data={data.categoryBreakdown} />
                </div>
            </div>
        </AppShell>
    );
}
