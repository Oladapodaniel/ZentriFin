"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <AppShell>
            <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-center">
                <div className="p-4 rounded-full bg-muted">
                    <Settings className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Settings Coming Soon</h1>
                <p className="text-muted-foreground max-w-md">
                    Advanced configuration and user preferences will be available here shortly.
                </p>
            </div>
        </AppShell>
    );
}
