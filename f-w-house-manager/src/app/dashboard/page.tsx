"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Layout, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-foreground">User Portal</h1>
                <Button className="rounded-full h-12 px-6">
                    <Plus className="w-5 h-5 mr-2" />
                    Book Space
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-primary" />
                            Your Bookings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Info className="w-8 h-8 text-primary/40" />
                            </div>
                            <p className="text-muted-foreground font-medium">No active bookings found</p>
                            <p className="text-sm text-muted-foreground mt-1">Start by clicking "Book Space" above</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Layout className="w-5 h-5 mr-2 text-primary" />
                            Available Space
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="text-sm font-semibold mb-1">Cold Storage</div>
                            <div className="text-2xl font-bold text-primary">420sqft</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-sm font-semibold mb-1">General Warehouse</div>
                            <div className="text-2xl font-bold">1,850sqft</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
