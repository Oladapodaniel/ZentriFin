"use client";

import { AlertTriangle, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidationSummary } from "@/types";
import { Button } from "@/components/ui/button";

interface ValidationPanelProps {
    summary?: ValidationSummary;
}

export function ValidationPanel({ summary }: ValidationPanelProps) {
    if (!summary) return null;

    const hasErrors = summary.balanceErrors > 0 || summary.currencyMismatches > 0;

    return (
        <Card className="h-fit sticky top-24">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    {hasErrors ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                    Validation Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary/50">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="h-4 w-4" /> Balance Checks
                        </span>
                        <span className={summary.balanceErrors > 0 ? "text-destructive font-bold" : "text-emerald-500 font-medium"}>
                            {summary.balanceErrors > 0 ? `${summary.balanceErrors} Errors` : "Passed"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary/50">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <HelpCircle className="h-4 w-4" /> Uncategorized
                        </span>
                        <span className={summary.uncategorizedCount > 0 ? "text-amber-500 font-medium" : "text-muted-foreground"}>
                            {summary.uncategorizedCount} Items
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary/50">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <AlertTriangle className="h-4 w-4" /> Duplicates
                        </span>
                        <span className={summary.potentialDuplicates > 0 ? "text-amber-500 font-medium" : "text-muted-foreground"}>
                            {summary.potentialDuplicates} Potential
                        </span>
                    </div>
                </div>

                {summary.uncategorizedCount > 0 && (
                    <Button variant="outline" className="w-full text-xs h-8">
                        Auto-categorize All
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
