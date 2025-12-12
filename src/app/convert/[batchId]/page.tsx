"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, Download, ArrowLeft, Check, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { motion } from "framer-motion";

import { AppShell } from "@/components/layout/AppShell";
import { TransactionTable } from "@/components/preview/TransactionTable";
import { ValidationPanel } from "@/components/preview/ValidationPanel";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Batch, Transaction } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const STEPS = ["Upload", "Extract", "Validate", "Export"];

export default function PreviewPage() {
    const params = useParams();
    const router = useRouter();
    const batchId = params.batchId as string;

    const [batch, setBatch] = useState<Batch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState("excel");
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    useEffect(() => {
        const loadBatch = async () => {
            try {
                const data = await api.getBatch(batchId);
                if (!data) {
                    toast.error("Batch not found");
                    router.push("/convert");
                    return;
                }
                setBatch(data);
                if (data.files.length > 0) {
                    setSelectedFileId(data.files[0].id);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load batch");
            } finally {
                setIsLoading(false);
            }
        };

        if (batchId) loadBatch();
    }, [batchId, router]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdateTransaction = (id: string, field: keyof Transaction, value: any) => {
        if (!batch) return;

        const updatedTransactions = batch.transactions.map(t =>
            t.id === id ? { ...t, [field]: value } : t
        );

        setBatch({ ...batch, transactions: updatedTransactions });
    };

    const handleExport = async () => {
        if (!batch) return;
        setIsExporting(true);

        try {
            // Dynamically import libraries to avoid SSR issues
            const XLSX = await import('xlsx');
            const { saveAs } = await import('file-saver');

            const filename = `batch_${batch.id.slice(0, 8)}_export`;
            const data = batch.transactions.map(t => ({
                Date: new Date(t.date).toLocaleDateString(),
                Description: t.description,
                Category: t.category,
                Amount: t.amount,
                Debit: t.debit,
                Credit: t.credit,
                Balance: t.balance,
                Currency: t.currency
            }));

            if (exportFormat === 'excel') {
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(wb, ws, "Transactions");
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
                saveAs(blob, `${filename}.xlsx`);
            } else if (exportFormat === 'csv') {
                const ws = XLSX.utils.json_to_sheet(data);
                const csv = XLSX.utils.sheet_to_csv(ws);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                saveAs(blob, `${filename}.csv`);
            } else if (exportFormat === 'json') {
                const blob = new Blob([JSON.stringify(batch.transactions, null, 2)], { type: 'application/json' });
                saveAs(blob, `${filename}.json`);
            } else if (exportFormat === 'qbo') {
                // Basic QBO (OFX/QBO) format construction
                const qboContent = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>${new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}
<LANGUAGE>ENG
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>${batch.transactions[0]?.currency || 'USD'}
<BANKACCTFROM>
<BANKID>999999999
<ACCTID>123456789
<ACCTTYPE>CHECKING
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>${new Date(batch.transactions[0]?.date || Date.now()).toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}
<DTEND>${new Date(batch.transactions[batch.transactions.length - 1]?.date || Date.now()).toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}
${batch.transactions.map(t => `<STMTTRN>
<TRNTYPE>${t.amount < 0 ? 'DEBIT' : 'CREDIT'}
<DTPOSTED>${new Date(t.date).toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}
<TRNAMT>${t.amount}
<FITID>${t.id}
<NAME>${t.description}
<MEMO>${t.category || ''}
</STMTTRN>`).join('\n')}
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>${batch.transactions[batch.transactions.length - 1]?.balance || 0}
<DTASOF>${new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;
                const blob = new Blob([qboContent], { type: 'application/vnd.intu.qbo' });
                saveAs(blob, `${filename}.qbo`);
            }

            toast.success(`Exported as ${exportFormat.toUpperCase()}`);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error("Failed to export data");
        } finally {
            setIsExporting(false);
        }
    };

    if (!batch) return null;

    return (
        <AppShell>
            <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
                {/* Header & Steps */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 shrink-0">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="pl-0 text-muted-foreground hover:text-foreground mb-2"
                            onClick={() => router.push("/convert")}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Upload
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">Batch #{batch.id.slice(0, 8)}</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {batch.files.length} files · {batch.transactions.length} transactions extracted
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        {STEPS.map((step, i) => (
                            <div key={step} className="flex items-center">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${step === "Validate"
                                    ? "bg-primary text-primary-foreground font-medium"
                                    : i < 2
                                        ? "text-muted-foreground"
                                        : "text-muted-foreground/50"
                                    }`}>
                                    {i < 2 && <Check className="h-3 w-3" />}
                                    {step}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 mx-1" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* Left Column: Validation & Transactions */}
                    <div className="flex flex-col lg:col-span-2 h-full gap-4 overflow-hidden">
                        {/* Validation Summary */}
                        <div className="shrink-0">
                            <ValidationPanel summary={batch.validationSummary} />
                        </div>

                        {/* Transactions Table */}
                        <div className="flex-1 overflow-auto border rounded-lg bg-card flex flex-col">
                            <TransactionTable
                                transactions={batch.transactions}
                                onUpdateTransaction={handleUpdateTransaction}
                                onDeleteTransactions={(ids) => {
                                    const updated = batch.transactions.filter(t => !ids.includes(t.id));
                                    setBatch({ ...batch, transactions: updated });
                                    toast.success(`Deleted ${ids.length} transactions`);
                                }}
                                onDuplicateTransactions={(ids) => {
                                    const toDuplicate = batch.transactions.filter(t => ids.includes(t.id));
                                    const newTransactions = toDuplicate.map(t => ({
                                        ...t,
                                        id: Math.random().toString(36).substr(2, 9),
                                        description: `${t.description} (Copy)`
                                    }));
                                    // Insert after the last selected item or at end? Let's append for now or insert after.
                                    // Appending is safer for index stability.
                                    setBatch({ ...batch, transactions: [...batch.transactions, ...newTransactions] });
                                    toast.success(`Duplicated ${ids.length} transactions`);
                                }}
                                onExport={() => document.getElementById('export-trigger')?.click()}
                            />
                        </div>
                    </div>

                    {/* Right Column: PDF Viewer */}
                    <div className="flex flex-col lg:col-span-1 h-full gap-4 overflow-hidden">
                        {/* File Selector */}
                        {batch.files.length > 1 && (
                            <Select value={selectedFileId || ""} onValueChange={setSelectedFileId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select file to preview" />
                                </SelectTrigger>
                                <SelectContent>
                                    {batch.files.map(f => (
                                        <SelectItem key={f.id} value={f.id}>{f.filename}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {/* PDF Viewer */}
                        <div className="flex-1 border rounded-lg overflow-hidden bg-muted relative">
                            {selectedFileId ? (
                                <iframe
                                    src={`/api/files/${selectedFileId}`}
                                    className="w-full h-full"
                                    title="PDF Preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No file selected
                                </div>
                            )}
                        </div>

                        {/* Export Button (kept here or moved? User said summary card above table, PDF stretches down. Export button can stay here or go to header? Let's keep it here for now as primary action) */}
                        <div className="shrink-0">

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button id="export-trigger" size="lg" className="w-full font-semibold shadow-lg shadow-primary/20">
                                        Export Data <Download className="ml-2 h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                {/* ... Dialog Content ... */}
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Export Configuration</DialogTitle>
                                        <DialogDescription>
                                            Choose your preferred format and settings.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-6 py-4">
                                        <div className="space-y-3">
                                            <Label>Format</Label>
                                            <RadioGroup defaultValue="excel" value={exportFormat} onValueChange={setExportFormat} className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <RadioGroupItem value="excel" id="excel" className="peer sr-only" />
                                                    <Label
                                                        htmlFor="excel"
                                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                    >
                                                        <FileSpreadsheet className="mb-3 h-6 w-6" />
                                                        Excel
                                                    </Label>
                                                </div>
                                                <div>
                                                    <RadioGroupItem value="csv" id="csv" className="peer sr-only" />
                                                    <Label
                                                        htmlFor="csv"
                                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                    >
                                                        <FileText className="mb-3 h-6 w-6" />
                                                        CSV
                                                    </Label>
                                                </div>
                                                <div>
                                                    <RadioGroupItem value="json" id="json" className="peer sr-only" />
                                                    <Label
                                                        htmlFor="json"
                                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                    >
                                                        <FileJson className="mb-3 h-6 w-6" />
                                                        JSON
                                                    </Label>
                                                </div>
                                                <div>
                                                    <RadioGroupItem value="qbo" id="qbo" className="peer sr-only" />
                                                    <Label
                                                        htmlFor="qbo"
                                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                    >
                                                        <span className="mb-3 text-xl font-bold">QBO</span>
                                                        QuickBooks
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        <div className="flex items-center justify-between space-x-2">
                                            <Label htmlFor="summary-sheet" className="flex flex-col space-y-1">
                                                <span>Include Summary Sheet</span>
                                                <span className="font-normal text-xs text-muted-foreground">Add a separate tab with analytics</span>
                                            </Label>
                                            <Switch id="summary-sheet" defaultChecked />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button onClick={handleExport} disabled={isExporting} className="w-full">
                                            {isExporting ? "Exporting..." : "Download File"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
