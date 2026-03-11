"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Users,
    Search,
    Filter,
    UserPlus,
    MoreVertical,
    Mail,
    Shield,
    Activity,
    Trash2,
    Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userService } from "@/services/user.service";
import { User, UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

const roleConfig: Record<UserRole, { label: string; class: string }> = {
    admin: { label: "Administrator", class: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    staff: { label: "Warehouse Staff", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    customer: { label: "Customer", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
};

export default function UsersPage() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            Users <span className="text-white/20">|</span> <span className="text-2xl font-medium text-white/50">Access Control</span>
                        </h1>
                        <p className="text-white/40 mt-1 text-lg">Manage accounts, permissions, and customer relationships.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] gap-2">
                            <UserPlus className="w-4 h-4" /> Add User
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/20" />
                        <Input
                            placeholder="Search by email or role..."
                            className="pl-10 h-10 bg-white/5 border-white/10 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 h-10 px-4">
                        <Filter className="w-4 h-4" /> Role Filter
                    </Button>
                </div>

                {/* User Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <Card key={i} className="glass-card h-48 animate-pulse" />
                        ))
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                            const config = roleConfig[user.role];
                            return (
                                <Card key={user.id} className="glass-card group hover:scale-[1.02] transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                <Users className="w-7 h-7 text-white/50" />
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10">
                                                    <Edit2 className="w-4 h-4 text-white/30" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-400">
                                                    <Trash2 className="w-4 h-4 text-white/30" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="font-bold text-lg text-white truncate">{user.email}</div>
                                                <div className="text-xs text-white/30 mt-1 flex items-center gap-1.5">
                                                    <Shield className="w-3 h-3" /> User ID: {user.id.slice(0, 8)}...
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", config.class)}>
                                                    {config.label}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn("w-2 h-2 rounded-full", user.isActive ? "bg-emerald-500 animate-pulse" : "bg-white/20")} />
                                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                                        {user.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center flex flex-col items-center gap-3">
                            <Users className="w-12 h-12 text-white/10" />
                            <p className="text-white/30 italic text-lg">No users found</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
