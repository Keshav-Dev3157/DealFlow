'use client'

import { Deal } from "@/types";
import { DollarSign, TrendingUp, Activity, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
    deals: Deal[];
}

export default function StatsCards({ deals }: StatsCardsProps) {
    // 1. Total Revenue (Paid Deals)
    const totalRevenue = deals
        .filter(d => d.status === "paid")
        .reduce((sum, d) => sum + d.price, 0);

    // 2. Pipeline Value (Lead + Working)
    const pipelineValue = deals
        .filter(d => d.status === "lead" || d.status === "working")
        .reduce((sum, d) => sum + d.price, 0);

    // 3. Active Deals (Not Paid)
    const activeDealsCount = deals.filter(d => d.status !== "paid").length;

    // 4. Average Deal Size (All Deals)
    const avgDealSize = deals.length > 0
        ? deals.reduce((sum, d) => sum + d.price, 0) / deals.length
        : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="rounded-2xl border-none shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-slate-900">
                        ${totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-1">
                        +100% from last month
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                        Pipeline Value
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-slate-900">
                        ${pipelineValue.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-1">
                        Potential earnings
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold text-amber-600 uppercase tracking-wider">
                        Active Deals
                    </CardTitle>
                    <Activity className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-slate-900">
                        {activeDealsCount}
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-1">
                        Deals in progress
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                        Avg. Deal Size
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-slate-900">
                        ${avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-1">
                        Per campaign
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
