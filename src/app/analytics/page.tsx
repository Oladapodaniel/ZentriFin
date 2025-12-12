"use client";

import { AppShell } from "@/components/layout/AppShell";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <AppShell>
            <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-center">
                <div className="p-4 rounded-full bg-muted">
                    <BarChart3 className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics Coming Soon</h1>
                <p className="text-muted-foreground max-w-md">
                    We are building powerful insights to help you understand your financial data better. Check back later!
                </p>
            </div>
        </AppShell>
    );
}
