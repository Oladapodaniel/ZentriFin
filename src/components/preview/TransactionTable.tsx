"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import { Transaction } from "@/types";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionTableProps {
    transactions: Transaction[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdateTransaction: (id: string, field: keyof Transaction, value: any) => void;
    onDeleteTransactions?: (ids: string[]) => void;
    onDuplicateTransactions?: (ids: string[]) => void;
    onExport?: () => void;
}

export function TransactionTable({
    transactions,
    onUpdateTransaction,
    onDeleteTransactions,
    onDuplicateTransactions,
    onExport
}: TransactionTableProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [dateStart, setDateStart] = useState<string>("");
    const [dateEnd, setDateEnd] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.category?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
        const matchesDateStart = !dateStart || new Date(t.date) >= new Date(dateStart);
        const matchesDateEnd = !dateEnd || new Date(t.date) <= new Date(dateEnd);

        return matchesSearch && matchesCategory && matchesDateStart && matchesDateEnd;
    });

    const totalPages = Math.ceil(filteredTransactions.length / pageSize);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const categories = Array.from(new Set(transactions.map(t => t.category).filter(Boolean)));

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredTransactions.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredTransactions.map(t => t.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkDelete = () => {
        if (onDeleteTransactions) {
            onDeleteTransactions(Array.from(selectedIds));
            setSelectedIds(new Set());
        }
    };

    const handleBulkDuplicate = () => {
        if (onDuplicateTransactions) {
            onDuplicateTransactions(Array.from(selectedIds));
            setSelectedIds(new Set());
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-2 px-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {selectedIds.size > 0 ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-5">
                            <span className="text-sm font-medium">{selectedIds.size} selected</span>
                            <div className="h-4 w-px bg-border mx-2" />
                            <Button size="sm" variant="secondary" onClick={handleBulkDuplicate}>
                                Duplicate
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                                Delete
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search transactions..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className={categoryFilter !== 'all' || dateStart || dateEnd ? "bg-secondary border-primary" : ""}>
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Filters</h4>
                                            <p className="text-sm text-muted-foreground">Refine the transaction list.</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Category</Label>
                                            <Select value={categoryFilter} onValueChange={(val) => {
                                                setCategoryFilter(val);
                                                setCurrentPage(1);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Categories</SelectItem>
                                                    {categories.map(c => (
                                                        <SelectItem key={c} value={c as string}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Date Range</Label>
                                            <div className="flex gap-2">
                                                <Input type="date" value={dateStart} onChange={e => {
                                                    setDateStart(e.target.value);
                                                    setCurrentPage(1);
                                                }} />
                                                <Input type="date" value={dateEnd} onChange={e => {
                                                    setDateEnd(e.target.value);
                                                    setCurrentPage(1);
                                                }} />
                                            </div>
                                        </div>
                                        {(categoryFilter !== 'all' || dateStart || dateEnd) && (
                                            <Button variant="ghost" onClick={() => {
                                                setCategoryFilter("all");
                                                setDateStart("");
                                                setDateEnd("");
                                                setCurrentPage(1);
                                            }}>
                                                Reset Filters
                                            </Button>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline-block">
                        {filteredTransactions.length} transactions
                    </span>
                    <Button variant="outline" size="sm" onClick={onExport} disabled={!onExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={filteredTransactions.length > 0 && selectedIds.size === filteredTransactions.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-[300px]">Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Debit</TableHead>
                            <TableHead className="text-right">Credit</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.map((t) => (
                            <TableRow key={t.id} className={cn(selectedIds.has(t.id) && "bg-secondary/50")}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.has(t.id)}
                                        onCheckedChange={() => toggleSelect(t.id)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={new Date(t.date).toISOString().split('T')[0]}
                                        onChange={(e) => onUpdateTransaction(t.id, "date", e.target.value)}
                                        className="h-8 w-32 border-transparent hover:border-border focus:border-primary bg-transparent"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={t.description}
                                        onChange={(e) => onUpdateTransaction(t.id, "description", e.target.value)}
                                        className="h-8 w-full border-transparent hover:border-border focus:border-primary bg-transparent"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={t.category || ""}
                                        onChange={(e) => onUpdateTransaction(t.id, "category", e.target.value)}
                                        className="h-8 w-32 border-transparent hover:border-border focus:border-primary bg-transparent"
                                        placeholder="Category"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Input
                                        type="number"
                                        value={t.debit || ""}
                                        onChange={(e) => onUpdateTransaction(t.id, "debit", parseFloat(e.target.value) || 0)}
                                        className="h-8 w-24 border-transparent hover:border-border focus:border-primary bg-transparent text-right font-mono"
                                        placeholder="-"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Input
                                        type="number"
                                        value={t.credit || ""}
                                        onChange={(e) => onUpdateTransaction(t.id, "credit", parseFloat(e.target.value) || 0)}
                                        className="h-8 w-24 border-transparent hover:border-border focus:border-primary bg-transparent text-right font-mono text-emerald-600"
                                        placeholder="-"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Input
                                        type="number"
                                        value={t.balance || ""}
                                        onChange={(e) => onUpdateTransaction(t.id, "balance", parseFloat(e.target.value) || 0)}
                                        className="h-8 w-24 border-transparent hover:border-border focus:border-primary bg-transparent text-right font-mono text-muted-foreground"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            setPageSize(Number(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 50, 100].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
