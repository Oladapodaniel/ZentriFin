"use client";

import { FileText, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { BankStatementFile } from "@/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BatchListProps {
    files: BankStatementFile[];
    onRemoveFile?: (fileId: string) => void;
}

export function BatchList({ files, onRemoveFile }: BatchListProps) {
    if (files.length === 0) return null;

    return (
        <div className="w-full space-y-3 mt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Queue ({files.length})</span>
                <span>{files.reduce((acc, f) => acc + f.size, 0) / 1024 > 1024 ? `${(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB` : `${(files.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(0)} KB`}</span>
            </div>

            <div className="space-y-2">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className="group relative flex items-center gap-4 p-3 rounded-lg border bg-card shadow-sm transition-all"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                            <FileText className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium truncate pr-4">{file.filename}</p>
                                <div className="flex items-center gap-2 shrink-0">
                                    {file.status === "completed" && (
                                        <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-500">
                                            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                                        </span>
                                    )}
                                    {file.status === "error" && (
                                        <span className="flex items-center text-xs font-medium text-destructive">
                                            <AlertCircle className="mr-1 h-3 w-3" /> Error
                                        </span>
                                    )}
                                    {file.status === "processing" && (
                                        <span className="flex items-center text-xs font-medium text-primary">
                                            <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Processing
                                        </span>
                                    )}
                                    {file.status === "pending" && (
                                        <span className="text-xs text-muted-foreground">Pending</span>
                                    )}
                                </div>
                            </div>

                            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                <Progress
                                    value={file.status === "completed" ? 100 : file.progress}
                                    className="h-full w-full"
                                />
                            </div>
                        </div>

                        {file.status === "pending" && onRemoveFile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2 bg-background border shadow-sm rounded-full"
                                onClick={() => onRemoveFile(file.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
