"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

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

    if (!isReady) return null;

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 ml-[calc(16rem+2rem)] p-8">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
}
