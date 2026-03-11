"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ShoppingCart,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Clock,
    CheckCircle2,
    AlertCircle,
    Package,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orderService } from "@/services/order.service";
import { Order, OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

const statusConfig: Record<OrderStatus, { label: string; icon: any; class: string }> = {
    pending: { label: "Pending", icon: Clock, class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    processing: { label: "Processing", icon: Activity, class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    shipped: { label: "Shipped", icon: Package, class: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    delivered: { label: "Delivered", icon: CheckCircle2, class: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    cancelled: { label: "Cancelled", icon: AlertCircle, class: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
};

function Activity({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            Orders <span className="text-white/20">|</span> <span className="text-2xl font-medium text-white/50">Fullfillment</span>
                        </h1>
                        <p className="text-white/40 mt-1 text-lg">Track and manage incoming and outgoing shipments.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] gap-2">
                            <Plus className="w-4 h-4" /> New Order
                        </Button>
                    </div>
                </div>

                {/* Table Controls */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/20" />
                        <Input
                            placeholder="Search by order number or customer..."
                            className="pl-10 h-10 bg-white/5 border-white/10 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 h-10 px-4">
                        <Filter className="w-4 h-4" /> Filters
                    </Button>
                </div>

                {/* Orders List */}
                <div className="grid grid-cols-1 gap-4">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <Card key={i} className="glass-card h-32 animate-pulse" />
                        ))
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => {
                            const config = statusConfig[order.status];
                            const StatusIcon = config.icon;
                            return (
                                <Card key={order.id} className="glass-card group hover:bg-white/10 transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", config.class)}>
                                                    <StatusIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-bold text-lg">{order.orderNumber}</span>
                                                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                            order.type === 'inbound' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                                        )}>
                                                            {order.type}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-white/40">{order.customer?.email || "System Order"} • {new Date(order.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-white/30 text-xs uppercase tracking-widest font-bold mb-1">Items</div>
                                                    <div className="text-white font-medium">{order.items.length} units</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white/30 text-xs uppercase tracking-widest font-bold mb-1">Value</div>
                                                    <div className="text-white font-bold text-lg">${order.totalAmount.toLocaleString()}</div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10">
                                                    <ArrowRight className="w-5 h-5 text-white/40" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <Card className="glass-card p-20 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <ShoppingCart className="w-12 h-12 text-white/10" />
                                <p className="text-white/30 italic">No orders found</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
