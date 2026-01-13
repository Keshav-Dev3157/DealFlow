'use client'

import { useState, useEffect } from "react";
import { Deal, Profile } from "@/types";
import StatsCards from "@/components/StatsCards";
import RevenueChart from "@/components/RevenueChart";
import GoalTracker from "@/components/GoalTracker";
import InsightsSummary from "@/components/InsightsSummary";
import KanbanBoard from "@/components/KanbanBoard";
import { Briefcase, BarChart3, LayoutDashboard, Search, Plus } from "lucide-react";
import NewDealDialog from "@/components/NewDealDialog";

interface DashboardContentProps {
    profile: Profile | null;
    deals: Deal[];
    currentMonthRevenue: number;
}

export default function DashboardContent({ profile, deals, currentMonthRevenue }: DashboardContentProps) {
    const [activeTab, setActiveTab] = useState<'operations' | 'insights'>('operations');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="space-y-10 animate-pulse">
            <div className="h-32 bg-secondary rounded-[32px]" />
            <div className="h-[500px] bg-secondary rounded-[32px]" />
        </div>
    );

    return (
        <div className="space-y-6 md:space-y-10">
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden bg-card border border-border rounded-2xl p-1 shadow-sm sticky top-[72px] z-20 backdrop-blur-md bg-opacity-80">
                <button
                    onClick={() => setActiveTab('operations')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'operations'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'text-muted-foreground'
                        }`}
                >
                    <Briefcase size={14} />
                    Operations
                </button>
                <button
                    onClick={() => setActiveTab('insights')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'insights'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'text-muted-foreground'
                        }`}
                >
                    <BarChart3 size={14} />
                    Insights
                </button>
            </div>

            {/* Operations View */}
            <div className={`space-y-8 ${activeTab === 'operations' ? 'block' : 'hidden lg:block'}`}>
                <StatsCards deals={deals} />

                {deals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-card rounded-[32px] border border-border shadow-sm text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6 text-muted-foreground">
                            <LayoutDashboard size={32} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">System Offline</h3>
                        <p className="text-sm md:text-base text-muted-foreground max-w-sm mt-3 font-medium">
                            Initialize your operational pipeline. Add your first commercial deal to start tracking revenue.
                        </p>
                        <div className="mt-8">
                            <NewDealDialog />
                        </div>
                    </div>
                ) : (
                    <KanbanBoard deals={deals} />
                )}
            </div>

            {/* Insights View */}
            <div className={`space-y-6 md:space-y-8 ${activeTab === 'insights' ? 'block' : 'hidden lg:block'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <GoalTracker
                            currentRevenue={currentMonthRevenue}
                            goal={profile?.revenue_goal || 0}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <InsightsSummary deals={deals} />
                    </div>
                </div>
                <RevenueChart deals={deals} />
            </div>
        </div>
    );
}
