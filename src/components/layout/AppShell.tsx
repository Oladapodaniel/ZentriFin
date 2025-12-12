"use client";

import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex min-h-screen w-full">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
                <TopNav />
                <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
