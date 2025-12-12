"use client";

import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const INTEGRATIONS = [
    { id: "qbo", name: "QuickBooks Online", icon: "QB", connected: false, color: "bg-green-600" },
    { id: "xero", name: "Xero", icon: "X", connected: false, color: "bg-blue-500" },
    { id: "sage", name: "Sage Intacct", icon: "S", connected: false, color: "bg-red-500" },
];

export function IntegrationsPanel() {
    const [integrations, setIntegrations] = useState(INTEGRATIONS);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleConnect = (id: string) => {
        setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true } : i));
        setSelectedId(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">Accounting Software</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {integrations.map((integration) => (
                    <Card key={integration.id} className="relative overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold ${integration.color}`}>
                                    {integration.icon}
                                </div>
                                {integration.connected ? (
                                    <Badge variant="secondary" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                                        Connected
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Not Connected</Badge>
                                )}
                            </div>
                            <CardTitle className="mt-4 text-base">{integration.name}</CardTitle>
                            <CardDescription className="text-xs">
                                Sync transactions and bank feeds automatically.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {integration.connected ? (
                                <Button variant="outline" className="w-full" disabled>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Synced
                                </Button>
                            ) : (
                                <Dialog open={selectedId === integration.id} onOpenChange={(open) => setSelectedId(open ? integration.id : null)}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" variant="secondary">
                                            <Plus className="mr-2 h-4 w-4" /> Connect
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Connect to {integration.name}</DialogTitle>
                                            <DialogDescription>
                                                You are about to authorize BankStatement Pro to access your {integration.name} account.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4 text-sm text-muted-foreground">
                                            <p>Permissions requested:</p>
                                            <ul className="list-disc list-inside mt-2 space-y-1">
                                                <li>View chart of accounts</li>
                                                <li>Create bank transactions</li>
                                                <li>Read company info</li>
                                            </ul>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setSelectedId(null)}>Cancel</Button>
                                            <Button onClick={() => handleConnect(integration.id)}>Authorize Connection</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
