"use client";

import { useState, useEffect } from "react";
import { Copy, Eye, EyeOff, RefreshCw, Play, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { ApiKey } from "@/types";

export function ApiKeyConsole() {
    const [apiKey, setApiKey] = useState<ApiKey | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [testUrl, setTestUrl] = useState("https://example.com/statement.pdf");
    const [testResponse, setTestResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Generate a key on load if none exists
        api.generateApiKey().then(setApiKey);
    }, []);

    const handleCopy = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey.key);
        setIsCopied(true);
        toast.success("API key copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleTestRequest = async () => {
        setIsLoading(true);
        setTestResponse(null);

        // Simulate request delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        setTestResponse(JSON.stringify({
            status: "success",
            batch_id: "batch_123abc",
            files_processed: 1,
            transactions: [
                {
                    date: "2023-12-01",
                    description: "AWS SERVICE",
                    amount: -124.50,
                    currency: "USD"
                }
            ]
        }, null, 2));

        setIsLoading(false);
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* API Key Management */}
            <Card>
                <CardHeader>
                    <CardTitle>API Credentials</CardTitle>
                    <CardDescription>Manage your secret keys for API access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Secret Key</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    readOnly
                                    value={apiKey ? (isVisible ? apiKey.key : apiKey.masked) : "Generating..."}
                                    className="font-mono pr-10"
                                />
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setIsVisible(!isVisible)}>
                                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleCopy}>
                                {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Created on {apiKey ? new Date(apiKey.createdAt).toLocaleDateString() : "..."}
                        </p>
                    </div>

                    <Button variant="secondary" className="w-full" onClick={() => api.generateApiKey().then(setApiKey)}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Roll Key
                    </Button>
                </CardContent>
            </Card>

            {/* Test Console */}
            <Card>
                <CardHeader>
                    <CardTitle>Test Console</CardTitle>
                    <CardDescription>Send a test request to verify your integration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>File URL</Label>
                        <Input value={testUrl} onChange={(e) => setTestUrl(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Output Format</Label>
                        <Select defaultValue="json">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleTestRequest} disabled={isLoading} className="w-full">
                        {isLoading ? "Sending Request..." : (
                            <>
                                <Play className="mr-2 h-4 w-4" /> Send Test Request
                            </>
                        )}
                    </Button>

                    {testResponse && (
                        <div className="mt-4 rounded-md bg-muted p-4 overflow-x-auto">
                            <pre className="text-xs font-mono text-foreground">{testResponse}</pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
