"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Webhook } from "lucide-react";

export default function ApiPage() {
    return (
        <AppShell>
            <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-center">
                <div className="p-4 rounded-full bg-muted">
                    <Webhook className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Integrations Coming Soon</h1>
                <p className="text-muted-foreground max-w-md">
                    Connect with QuickBooks, Xero, and other accounting software directly from BankStatement Pro.
                </p>
            </div>
        </AppShell>
    );
}
