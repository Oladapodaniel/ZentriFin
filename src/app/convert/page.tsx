"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, FileSpreadsheet, Zap } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { UploadArea } from "@/components/convert/UploadArea";
import { BatchList } from "@/components/convert/BatchList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { BankStatementFile } from "@/types";

export default function ConvertPage() {
    const router = useRouter();
    const [files, setFiles] = useState<BankStatementFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [mergeMode, setMergeMode] = useState(true);

    const handleFilesSelected = async (selectedFiles: File[]) => {
        // Optimistically show files
        const tempFiles: BankStatementFile[] = selectedFiles.map(f => ({
            id: Math.random().toString(36),
            file: f,
            filename: f.name,
            size: f.size,
            status: "pending",
            progress: 0
        }));
        setFiles(prev => [...prev, ...tempFiles]);

        // Set default project name if empty
        if (!projectName && selectedFiles.length > 0) {
            setProjectName(selectedFiles[0].name.split('.')[0]);
        }
    };

    const handleRemoveFile = (fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleStartConversion = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        toast.info("Uploading and starting conversion...");

        try {
            const rawFiles = files.map(f => f.file).filter((f): f is File => f !== undefined);
            const result = await api.uploadStatements(rawFiles, projectName, mergeMode ? 'merge' : 'separate');

            if ('projects' in result && result.projects) {
                // Separate Mode: Process all projects
                toast.info(`Processing ${result.projects.length} projects...`);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await Promise.all(result.projects.map((p: any) =>
                    api.processBatch(p.id, () => { })
                ));

                toast.success("All projects started!");
                router.push('/projects');
            } else {
                // Merge Mode: Single Batch
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const batch = result as any;

                // Update local files with backend data (to get real IDs)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // Update local files with backend data (to get real IDs)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const backendFiles = batch.files.map((f: any) => {
                    const localFile = files.find(lf => lf.filename === f.filename);
                    return {
                        id: f.id,
                        file: localFile?.file,
                        filename: f.filename,
                        size: localFile?.size || 0,
                        status: f.status,
                        progress: f.status === 'completed' ? 100 : 0
                    };
                });
                setFiles(backendFiles);

                // Trigger processing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await api.processBatch(batch.id, (fileId: string, progress: number) => {
                    console.log(`Progress update: ${fileId} - ${progress}%`);
                    setFiles(prev => prev.map(f =>
                        f.id === fileId ? { ...f, progress, status: progress === 100 ? 'completed' : 'processing' } : f
                    ));
                });

                toast.success("Conversion completed!");
                router.push(`/convert/${batch.id}`);
            }

        } catch (error) {
            toast.error("Conversion failed");
            setIsProcessing(false);
            console.error(error);
        }
    };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-4 py-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
                    >
                        Convert bank statements to<br />
                        <span className="text-primary">clean, structured data</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Stop manual data entry. Upload PDF statements and export to Excel, CSV, or QuickBooks in seconds.
                    </motion.p>
                </div>

                {/* Main Conversion Card */}
                <Card className="border-border/60 shadow-lg">
                    <CardContent className="p-6 md:p-10 space-y-8">
                        <UploadArea onFilesSelected={handleFilesSelected} disabled={isProcessing} />

                        <AnimatePresence>
                            {files.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="grid gap-6 p-6 border rounded-lg bg-muted/20 mb-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="projectName">Project Name</Label>
                                            <Input
                                                id="projectName"
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                                placeholder="e.g. Q1 Financials"
                                                disabled={isProcessing}
                                            />
                                        </div>

                                        {files.length > 1 && (
                                            <div className="flex items-center justify-between space-x-2">
                                                <Label htmlFor="merge-mode" className="flex flex-col space-y-1">
                                                    <span>Merge into one project</span>
                                                    <span className="font-normal text-xs text-muted-foreground">
                                                        {mergeMode ? "All files will be in a single project" : "Each file will be a separate project"}
                                                    </span>
                                                </Label>
                                                <Switch
                                                    id="merge-mode"
                                                    checked={mergeMode}
                                                    onCheckedChange={setMergeMode}
                                                    disabled={isProcessing}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <BatchList files={files} onRemoveFile={isProcessing ? undefined : handleRemoveFile} />

                                    <div className="flex justify-end mt-6">
                                        <Button
                                            size="lg"
                                            onClick={handleStartConversion}
                                            disabled={isProcessing || files.some(f => f.status === "completed")}
                                            className="w-full md:w-auto font-semibold text-base"
                                        >
                                            {isProcessing ? "Converting..." : "Start Conversion"}
                                            {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Features / Trust */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                    {[
                        { icon: FileSpreadsheet, title: "Multiple Formats", desc: "Export to Excel, CSV, JSON, or QBO." },
                        { icon: ShieldCheck, title: "Bank-Grade Security", desc: "256-bit encryption & auto-deletion." },
                        { icon: Zap, title: "99% Accuracy", desc: "AI-powered detection for all major banks." },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="flex flex-col items-center text-center p-4 rounded-lg bg-secondary/30 border border-border/50"
                        >
                            <div className="p-3 rounded-full bg-background border shadow-sm mb-3 text-primary">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
