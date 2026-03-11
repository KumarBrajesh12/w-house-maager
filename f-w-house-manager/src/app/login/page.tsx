"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Warehouse, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const response = await authService.login({ email, password });

            // Redirect based on role
            const role = response.user?.role;
            if (role === 'admin') {
                router.push("/admin/dashboard");
            } else if (role === 'employee') {
                router.push("/employee/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err?.error || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Blur Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />

            <Card className="w-full max-w-md glass p-4 animate-in fade-in zoom-in duration-500">
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-4">
                        <Warehouse className="text-black w-7 h-7" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-white">Welcome Back</CardTitle>
                    <CardDescription className="text-white/50 text-base">
                        Enter your credentials to access the WMS
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-white/30" />
                                <Input
                                    name="email"
                                    placeholder="Email address"
                                    type="email"
                                    required
                                    className="pl-11"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-white/30" />
                                <Input
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    required
                                    className="pl-11"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-base font-semibold group" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center pb-6">
                    <div className="text-sm text-white/40">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-white hover:underline font-medium decoration-white/30">
                            Create an account
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
