"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CreditCard, LogOut, Settings, User, Menu, FolderOpen, RefreshCw, BarChart3, Webhook, MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar"; // Reuse sidebar content for mobile

export function TopNav() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-transparent px-6 backdrop-blur supports-[backdrop-filter]:bg-transparent">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    {/* Mobile Sidebar Content - we can duplicate or extract the nav logic */}
                    <div className="h-full bg-sidebar flex flex-col">
                        <div className="flex h-16 items-center border-b px-6">
                            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground">
                                <img src="/fintech.png" alt="ZentriFin Logo" className="h-8 w-8 rounded-lg" />
                                <span>ZentriFin</span>
                            </Link>
                        </div>
                        <div className="flex-1 overflow-auto py-4">
                            <nav className="grid items-start px-4 text-sm font-medium gap-1">
                                {[
                                    { name: "Projects", href: "/projects", icon: FolderOpen },
                                    { name: "Convert", href: "/convert", icon: RefreshCw },
                                    { name: "Analytics", href: "/analytics", icon: BarChart3 },
                                    { name: "API & Integrations", href: "/api-integration", icon: Webhook },
                                    { name: "Feedback", href: "/feedback", icon: MessageSquare },
                                    { name: "Settings", href: "/settings", icon: Settings },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <div className="w-full flex-1">
                {/* Breadcrumbs or Page Title could go here */}
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
                        <span className="text-muted-foreground text-xs font-medium">Usage</span>
                        <span className="font-semibold text-foreground">120 / 200</span>
                    </div>
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                        Free Plan
                    </Badge>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9 border">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">John Doe</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    john@example.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
