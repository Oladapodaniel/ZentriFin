import { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-zinc-900 to-zinc-900" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                <div className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight">
                    <img src="/fintech_dark.png" alt="ZentriFin Logo" className="w-54 rounded-md" />
                </div>

                <div className="relative z-10 max-w-md">
                    <blockquote className="space-y-4">
                        <p className="text-xl font-medium leading-relaxed">
                            &ldquo;This platform has completely transformed how we handle financial data extraction. The accuracy and speed are unmatched.&rdquo;
                        </p>
                        <footer className="text-sm text-zinc-400">
                            <div className="font-semibold text-white">Sofia Davis</div>
                            <div>CFO at TechFlow</div>
                        </footer>
                    </blockquote>
                </div>

                <div className="relative z-10 text-sm text-zinc-500">
                    © 2024 ZentriFin. All rights reserved.
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-[400px] space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
