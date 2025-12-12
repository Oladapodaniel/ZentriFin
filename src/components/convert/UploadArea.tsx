"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
    onFilesSelected: (files: File[]) => void;
    disabled?: boolean;
}

export function UploadArea({ onFilesSelected, disabled }: UploadAreaProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesSelected(Array.from(e.dataTransfer.files));
        }
    }, [disabled, onFilesSelected]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesSelected(Array.from(e.target.files));
        }
    }, [onFilesSelected]);

    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out",
                isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border bg-card hover:bg-secondary/50",
                disabled && "opacity-50 cursor-not-allowed hover:bg-card"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className={cn(
                    "p-4 rounded-full mb-4 transition-colors",
                    isDragging ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                )}>
                    {isDragging ? <FileUp className="h-8 w-8" /> : <UploadCloud className="h-8 w-8" />}
                </div>

                <h3 className="text-lg font-semibold mb-1">
                    {isDragging ? "Drop files here" : "Drag & drop statements here"}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                    PDFs, Images (JPG, PNG), or CSVs. Up to 500 pages per batch.
                </p>

                <div className="relative">
                    <input
                        type="file"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        onChange={handleFileInput}
                        disabled={disabled}
                    />
                    <Button variant={isDragging ? "default" : "outline"} disabled={disabled}>
                        Browse Files
                    </Button>
                </div>

                <p className="mt-4 text-xs text-muted-foreground/60">
                    Secure 256-bit encryption. No data stored permanently.
                </p>
            </div>
        </div>
    );
}
