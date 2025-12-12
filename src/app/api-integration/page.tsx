"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ApiKeyConsole } from "@/components/api/ApiKeyConsole";
import { IntegrationsPanel } from "@/components/api/IntegrationsPanel";
import { Separator } from "@/components/ui/separator";

export default function ApiPage() {
    return (
        <AppShell>
            <div className="space-y-8 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">API & Integrations</h1>
                    <p className="text-muted-foreground">
                        Manage API keys and connect to your accounting software.
                    </p>
                </div>

                <ApiKeyConsole />

                <Separator />

                <IntegrationsPanel />
            </div>
        </AppShell>
    );
}
