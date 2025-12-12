"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    RefreshCw,
    BarChart3,
    Webhook,
    Settings,
    FileText,
    FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
    { name: "Convert", href: "/convert", icon: RefreshCw },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "API & Integrations", href: "/api-integration", icon: Webhook },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-sidebar md:block w-64 flex-col h-screen sticky top-0">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <FileText className="h-5 w-5" />
                    </div>
                    <span>BankStatement Pro</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto border-t p-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Theme</span>
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
}
