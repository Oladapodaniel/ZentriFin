"use client";

import { User, Settings, CreditCard, Shield, Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    const handleSave = () => {
        toast.success("Settings saved successfully");
    };

    return (
        <AppShell>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>

                <Tabs defaultValue="profile" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" /> Profile
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" /> Preferences
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Billing
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details and company info.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First name</Label>
                                        <Input id="firstName" defaultValue="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last name</Label>
                                        <Input id="lastName" defaultValue="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" defaultValue="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company Name</Label>
                                    <Input id="company" defaultValue="Acme Inc." />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="preferences">
                        <Card>
                            <CardHeader>
                                <CardTitle>App Preferences</CardTitle>
                                <CardDescription>Customize your conversion and export defaults.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="auto-cat" className="flex flex-col space-y-1">
                                        <span>Auto-categorization</span>
                                        <span className="font-normal text-xs text-muted-foreground">
                                            Automatically categorize transactions based on merchant names.
                                        </span>
                                    </Label>
                                    <Switch id="auto-cat" defaultChecked />
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label>Default Export Format</Label>
                                    <Select defaultValue="excel">
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Select format" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                                            <SelectItem value="csv">CSV</SelectItem>
                                            <SelectItem value="json">JSON</SelectItem>
                                            <SelectItem value="qbo">QuickBooks (.qbo)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Default Currency</Label>
                                    <Select defaultValue="usd">
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usd">USD ($)</SelectItem>
                                            <SelectItem value="eur">EUR (€)</SelectItem>
                                            <SelectItem value="gbp">GBP (£)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave}>Save Preferences</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="billing">
                        <Card>
                            <CardHeader>
                                <CardTitle>Plan & Billing</CardTitle>
                                <CardDescription>Manage your subscription and payment methods.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                                    <div>
                                        <h3 className="font-semibold">Free Plan</h3>
                                        <p className="text-sm text-muted-foreground">Up to 200 pages/month</p>
                                    </div>
                                    <Button variant="outline" disabled>Current Plan</Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg border-primary/20 bg-primary/5">
                                    <div>
                                        <h3 className="font-semibold text-primary">Pro Plan</h3>
                                        <p className="text-sm text-muted-foreground">Unlimited pages, API access, Priority support</p>
                                    </div>
                                    <Button onClick={() => toast.info("Billing integration coming soon!")}>Upgrade - $29/mo</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppShell>
    );
}
