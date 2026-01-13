'use client'

import { Deal } from "@/types";
import { DollarSign, TrendingUp, Activity, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
    deals: Deal[];
}

export default function StatsCards({ deals }: StatsCardsProps) {
    // 1. Total Earned (Paid Deals)
    const totalEarned = deals
        .filter(d => d.status === "paid")
        .reduce((sum, d) => sum + d.price, 0);

    // 2. Pending Invoices (Working Deals)
    const pendingInvoices = deals
        .filter(d => d.status === "working")
        .reduce((sum, d) => sum + d.price, 0);

    // 3. Potential Revenue (Lead Deals)
    const potentialRevenue = deals
        .filter(d => d.status === "lead")
        .reduce((sum, d) => sum + d.price, 0);

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-3xl border border-border bg-card shadow-lg shadow-emerald-500/5 overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                    <CardTitle className="text-[10px] md:text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Total Earned
                    </CardTitle>
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                        <DollarSign className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="text-2xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                        ${totalEarned.toLocaleString()}
                    </div>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold mt-1 md:mt-2 uppercase tracking-widest">
                        Verified Income
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-border bg-card shadow-lg shadow-amber-500/5 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                    <CardTitle className="text-[10px] md:text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                        Pending Invoices
                    </CardTitle>
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                        <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="text-2xl md:text-4xl font-black text-foreground tracking-tighter">
                        ${pendingInvoices.toLocaleString()}
                    </div>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold mt-1 md:mt-2 uppercase tracking-widest">
                        In progress &bull; {deals.filter(d => d.status === "working").length} deals
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-border bg-card shadow-lg shadow-indigo-500/5 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                    <CardTitle className="text-[10px] md:text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        Potential Revenue
                    </CardTitle>
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                        <Activity className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="text-2xl md:text-4xl font-black text-foreground tracking-tighter">
                        ${potentialRevenue.toLocaleString()}
                    </div>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold mt-1 md:mt-2 uppercase tracking-widest">
                        From leads &bull; {deals.filter(d => d.status === "lead").length} deals
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
