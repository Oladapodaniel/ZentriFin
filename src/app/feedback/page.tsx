"use client";

import { useForm, ValidationError } from "@formspree/react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function FeedbackPage() {
    if (!process.env.NEXT_PUBLIC_FORMSPREE_ID) {
        return (
            <AppShell>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                    <div className="p-4 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        {/* <ExclamationTriangle className="h-12 w-12" /> */}
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Error</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We are unable to process your feedback at this time. Please try again later.
                        </p>
                    </div>
                </div>
            </AppShell>
        );
    }
    const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_ID as string || "123");

    if (state.succeeded) {
        return (
            <AppShell>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                    <div className="p-4 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Thank you for your feedback!</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We appreciate your input. It helps us build a better product for you.
                        </p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Submit another response
                    </Button>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto space-y-8 py-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <MessageSquare className="h-8 w-8 text-primary" />
                        Feedback
                    </h1>
                    <p className="text-muted-foreground">
                        Help us improve ZentriFin by sharing your experience.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Share your thoughts</CardTitle>
                        <CardDescription>
                            Please fill out the form below. Your feedback is directly sent to our team.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            {/* Question 1 */}
                            <div className="space-y-2">
                                <Label htmlFor="ease-of-use">1. How easy was it to use the application?</Label>
                                <Select name="ease-of-use" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Very Easy">Very Easy</SelectItem>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Neutral">Neutral</SelectItem>
                                        <SelectItem value="Difficult">Difficult</SelectItem>
                                        <SelectItem value="Very Difficult">Very Difficult</SelectItem>
                                    </SelectContent>
                                </Select>
                                <ValidationError prefix="Ease of use" field="ease-of-use" errors={state.errors} />
                            </div>

                            {/* Question 2 */}
                            <div className="space-y-2">
                                <Label htmlFor="accuracy">2. Did the extraction accuracy meet your expectations?</Label>
                                <Select name="accuracy" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes, exceeded expectations">Yes, exceeded expectations</SelectItem>
                                        <SelectItem value="Yes, met expectations">Yes, met expectations</SelectItem>
                                        <SelectItem value="Partially">Partially</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                </Select>
                                <ValidationError prefix="Accuracy" field="accuracy" errors={state.errors} />
                            </div>

                            {/* Question 3 */}
                            <div className="space-y-2">
                                <Label htmlFor="missing-features">3. What features are missing that you would like to see?</Label>
                                <Textarea
                                    id="missing-features"
                                    name="missing-features"
                                    placeholder="e.g. Export to Xero, Dark mode improvements..."
                                />
                                <ValidationError prefix="Missing features" field="missing-features" errors={state.errors} />
                            </div>

                            {/* Question 4 */}
                            <div className="space-y-2">
                                <Label htmlFor="bugs">4. Did you encounter any bugs or issues?</Label>
                                <Textarea
                                    id="bugs"
                                    name="bugs"
                                    placeholder="Describe any issues you faced..."
                                />
                                <ValidationError prefix="Bugs" field="bugs" errors={state.errors} />
                            </div>

                            {/* Question 5 (Open Ended) */}
                            <div className="space-y-2">
                                <Label htmlFor="message">5. Is there anything else you'd like to share about your experience?</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Any other comments, suggestions, or thoughts..."
                                    className="min-h-[100px]"
                                    required
                                />
                                <ValidationError prefix="Message" field="message" errors={state.errors} />
                            </div>

                            <Button type="submit" className="w-full" disabled={state.submitting}>
                                {state.submitting ? "Sending..." : "Submit Feedback"}
                                {!state.submitting && <Send className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
