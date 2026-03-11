"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Warehouse, Plus, MoreVertical, MapPin, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WarehousesPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            Warehouses <span className="text-white/20">|</span> <span className="text-2xl font-medium text-white/50">Locations</span>
                        </h1>
                        <p className="text-white/40 mt-1 text-lg">Manage physical storage facilities and zone allocation.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] gap-2">
                            <Plus className="w-4 h-4" /> Add Warehouse
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: "Central Hub", location: "New York, US", zones: 12, capacity: "85%" },
                        { name: "West Coast Annex", location: "San Francisco, US", zones: 8, capacity: "42%" },
                        { name: "Euro Logistics", location: "Berlin, DE", zones: 15, capacity: "92%" },
                    ].map((wh) => (
                        <Card key={wh.name} className="glass-card group hover:bg-white/10 transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Warehouse className="w-6 h-6 text-white/50" />
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 hover:bg-white/10">
                                        <MoreVertical className="w-4 h-4 text-white/30" />
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{wh.name}</h3>
                                        <p className="text-sm text-white/40 flex items-center gap-1.5 mt-1">
                                            <MapPin className="w-3 h-3" /> {wh.location}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-white/20" />
                                            <span className="text-sm text-white/60">{wh.zones} active zones</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Capacity</div>
                                            <div className="text-sm font-bold text-white">{wh.capacity}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
