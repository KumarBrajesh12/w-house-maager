"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, Move, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmployeeDashboard() {
    const actions = [
        { title: "Receive Shipments", icon: Truck, description: "Scan and log incoming items" },
        { title: "Pick Orders", icon: Package, description: "Locate and prepare items for shipping" },
        { title: "Inventory Count", icon: CheckSquare, description: "Verify stock levels in assigned zone" },
        { title: "Relocate Stock", icon: Move, description: "Move items between storage bins" },
    ];

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-4xl font-bold text-foreground">Employee Operations</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {actions.map((action, idx) => (
                    <Card key={idx} className="glass hover:bg-white/5 transition-colors cursor-pointer group">
                        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                            <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <action.icon className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">{action.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Button className="w-full">Start Activity</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="glass p-6">
                <CardTitle className="mb-4">Recent Actions Log</CardTitle>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm">
                            <span className="text-muted-foreground">Order #342{i} picked by you</span>
                            <span className="text-xs text-muted-foreground">10 mins ago</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
