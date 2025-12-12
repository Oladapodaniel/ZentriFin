"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "@/lib/actions";
import { signIn } from "next-auth/react";

function SignupButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" size="lg" disabled={pending}>
            {pending ? "Creating account..." : "Sign Up"}
        </Button>
    );
}

export default function SignupPage() {
    const [errorMessage, dispatch] = useActionState(register, undefined);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                <p className="text-muted-foreground">Enter your information to get started</p>
            </div>

            <form action={dispatch} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input id="first-name" name="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input id="last-name" name="lastName" placeholder="Doe" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" placeholder="name@example.com" type="email" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>
                {errorMessage && (
                    <div className="text-sm text-destructive font-medium">
                        {errorMessage}
                    </div>
                )}
                <SignupButton />
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/projects" })}>
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google
                </Button>
                <Button variant="outline" className="w-full" onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/projects" })}>
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M1 1h10v10H1z" />
                        <path fill="#81bc06" d="M12 1h10v10H1z" />
                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                    Microsoft
                </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Sign in
                </Link>
            </div>
        </motion.div>
    );
}
