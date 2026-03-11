"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isReady, setIsReady] = React.useState(false);

    React.useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push("/login");
        } else {
            setIsReady(true);
        }
    }, [router]);

    const user = authService.getCurrentUser();
    const isSubscribed = user?.subscriptionStatus === 'active';

    if (!isReady) return null;

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 ml-[calc(16rem+2rem)] p-8">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {!isSubscribed && (
                        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm text-white/70">
                                <Zap className="w-5 h-5 text-purple-400" />
                                <span>You are currently on the free tier. Upgrade to Professional for more features.</span>
                            </div>
                            <Button variant="ghost" className="text-sm h-8 rounded-lg hover:bg-white/5" onClick={() => router.push('/pricing')}>
                                View Plans
                            </Button>
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
