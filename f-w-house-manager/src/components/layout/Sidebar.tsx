"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Warehouse,
    Settings,
    LogOut,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Warehouses", href: "/warehouses", icon: Warehouse },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-4 top-4 bottom-4 w-64 glass-card p-6 flex flex-col z-50">
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <Warehouse className="text-black w-6 h-6" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">WMS <span className="text-white/50">Pro</span></span>
            </div>

            <nav className="flex-1 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                isActive
                                    ? "bg-white/10 text-white border border-white/10 shadow-lg"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                isActive ? "text-white" : "text-white/50"
                            )} />
                            <span className="font-medium">{item.name}</span>
                            {isActive && <ChevronRight className="ml-auto w-4 h-4 text-white/50" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-4 py-6 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                    onClick={() => authService.logout()}
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </Button>
            </div>
        </aside>
    );
}
