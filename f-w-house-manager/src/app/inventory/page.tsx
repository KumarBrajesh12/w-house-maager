"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Package,
    Search,
    Filter,
    Plus,
    MoreVertical,
    ArrowUpDown,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inventoryService } from "@/services/inventory.service";
import { authService } from "@/services/auth.service";
import { InventoryItem } from "@/types/inventory";

export default function InventoryPage() {
    const [items, setItems] = React.useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        const fetchInventory = async () => {
            try {
                const user = authService.getCurrentUser();
                if (user) {
                    const data = await inventoryService.getCustomerInventory(user.id);
                    setItems(data);
                }
            } catch (error) {
                console.error("Failed to fetch inventory", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const filteredItems = items.filter(item =>
        item.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            Inventory <span className="text-white/20">|</span> <span className="text-2xl font-medium text-white/50">Stock Control</span>
                        </h1>
                        <p className="text-white/40 mt-1 text-lg">Manage and monitor your warehouse assets in real-time.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white gap-2">
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                        <Button className="rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] gap-2">
                            <Plus className="w-4 h-4" /> Add Item
                        </Button>
                    </div>
                </div>

                {/* Table Controls */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/20" />
                        <Input
                            placeholder="Search by name, SKU, or category..."
                            className="pl-10 h-10 bg-white/5 border-white/10 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 h-10 px-4">
                        <Filter className="w-4 h-4" /> Filters
                    </Button>
                </div>

                {/* Inventory List */}
                <Card className="glass-card overflow-hidden border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 font-semibold text-white/70 text-sm">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                            Item Details <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="p-4 font-semibold text-white/70 text-sm">SKU</th>
                                    <th className="p-4 font-semibold text-white/70 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-white/70 text-sm text-right">Stock Level</th>
                                    <th className="p-4 font-semibold text-white/70 text-sm text-right">Market Value</th>
                                    <th className="p-4 text-right w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={6} className="p-8 text-center text-white/10">Loading inventory data...</td>
                                        </tr>
                                    ))
                                ) : filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-white/40" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{item.item.name}</div>
                                                        <div className="text-xs text-white/30">{item.item.category?.name || "Uncategorized"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-xs text-white/50">{item.item.sku}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-semibold text-white">
                                                {item.quantity} <span className="text-white/30 text-xs font-normal ml-1">{item.item.unit}</span>
                                            </td>
                                            <td className="p-4 text-right font-medium text-white/80">
                                                ${(item.quantity * item.item.basePrice).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-lg h-8 w-8">
                                                    <MoreVertical className="w-4 h-4 text-white/30" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/10">
                                                    <Package className="w-8 h-8 text-white/10" />
                                                </div>
                                                <p className="text-white/30 italic">No items found matching your search</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
