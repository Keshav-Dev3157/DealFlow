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
        <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="rounded-[32px] border-none shadow-xl shadow-emerald-100/50 bg-white overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                        Total Earned
                    </CardTitle>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <DollarSign className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-emerald-600 tracking-tighter">
                        ${totalEarned.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                        Verified Income
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-[32px] border-none shadow-xl shadow-amber-100/50 bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-black text-amber-600 uppercase tracking-widest">
                        Pending Invoices
                    </CardTitle>
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">
                        ${pendingInvoices.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                        In progress &bull; {deals.filter(d => d.status === "working").length} deals
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-[32px] border-none shadow-xl shadow-indigo-100/50 bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                        Potential Revenue
                    </CardTitle>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Activity className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">
                        ${potentialRevenue.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                        From leads &bull; {deals.filter(d => d.status === "lead").length} deals
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
