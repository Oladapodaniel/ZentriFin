export type FileStatus = "pending" | "processing" | "completed" | "error";

export interface BankStatementFile {
    id: string;
    file: File; // The actual file object (not stored in DB in real app, but useful here)
    filename: string;
    size: number;
    bankName?: string;
    pageCount?: number;
    status: FileStatus;
    progress: number; // 0-100
    error?: string;
}

export interface Transaction {
    id: string;
    date: string; // ISO date string
    description: string;
    amount: number;
    debit?: number;
    credit?: number;
    balance?: number;
    currency: string;
    category: string;
    status?: "pending" | "verified" | "flagged";
}

export interface ValidationSummary {
    balanceErrors: number;
    uncategorizedCount: number;
    currencyMismatches: number;
    potentialDuplicates: number;
}

export interface Batch {
    id: string;
    files: BankStatementFile[];
    transactions: Transaction[];
    createdAt: string;
    status: "processing" | "ready" | "archived";
    validationSummary?: ValidationSummary;
}

export interface AnalyticsSummary {
    totalInflow: number;
    totalOutflow: number;
    netCashFlow: number;
    transactionCount: number;
    anomaliesCount: number;
    categoryBreakdown: { name: string; value: number; color: string }[];
    monthlyCashFlow: { name: string; inflow: number; outflow: number }[];
}

export interface ApiKey {
    key: string;
    createdAt: string;
    lastUsedAt?: string;
    masked: string;
}

export interface Project {
    id: string;
    name: string;
    date: string;
    status: "completed" | "processing" | "error";
    extractRate: number; // Percentage
    transactionCount: number;
    totalValue: number;
    currency: string;
}
