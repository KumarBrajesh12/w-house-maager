"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Shield, Bell, Globe, User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                        Settings <span className="text-white/20">|</span> <span className="text-2xl font-medium text-white/50">Configuration</span>
                    </h1>
                    <p className="text-white/40 mt-1 text-lg">Manage your profile, security, and global application preferences.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        {[
                            { label: "Profile", icon: User, active: true },
                            { label: "Security", icon: Shield, active: false },
                            { label: "Notifications", icon: Bell, active: false },
                            { label: "Regional", icon: Globe, active: false },
                        ].map((tab) => (
                            <Button
                                key={tab.label}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 px-4 py-6 rounded-xl transition-all",
                                    tab.active ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="font-semibold">{tab.label}</span>
                            </Button>
                        ))}
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>Update your personal details and contact information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/50 ml-1">First Name</label>
                                        <Input placeholder="John" className="bg-white/5 border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/50 ml-1">Last Name</label>
                                        <Input placeholder="Doe" className="bg-white/5 border-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/50 ml-1">Email Address</label>
                                    <Input placeholder="admin@wmspro.com" className="bg-white/5 border-white/10" />
                                </div>
                                <div className="pt-4 border-t border-white/5 flex justify-end">
                                    <Button className="rounded-xl px-8 gap-2">
                                        <Save className="w-4 h-4" /> Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
