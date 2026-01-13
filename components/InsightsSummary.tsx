'use client'

import { Deal } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BadgeDollarSign, PieChart } from "lucide-react";
import { useTheme } from "next-themes";

interface InsightsSummaryProps {
    deals: Deal[];
}

export default function InsightsSummary({ deals }: InsightsSummaryProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Calculate Average Deal Size
    const totalValue = deals.reduce((acc, deal) => acc + deal.price, 0);
    const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0;

    // Calculate Platform Distribution
    const platformDataMap: Record<string, number> = {};
    deals.forEach(deal => {
        const p = deal.platform || 'Instagram';
        platformDataMap[p] = (platformDataMap[p] || 0) + 1;
    });

    const platformData = Object.entries(platformDataMap).map(([name, value]) => ({
        name,
        value
    })).sort((a, b) => b.value - a.value);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Deal Size Card */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-2xl shadow-primary/5">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-6">
                    <BadgeDollarSign size={14} className="text-primary" />
                    Market Efficiency
                </h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-foreground tracking-tight">
                        ${Math.round(avgDealSize).toLocaleString()}
                    </p>
                    <span className="text-muted-foreground font-bold text-sm">avg. / deal</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4 font-medium leading-relaxed">
                    Based on your historical performance across {deals.length} active campaigns.
                </p>
            </div>

            {/* Platform Distribution Card */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-2xl shadow-primary/5">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-6">
                    <PieChart size={14} className="text-primary" />
                    Platform Dominance
                </h3>

                <div className="h-[120px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={platformData} layout="vertical" margin={{ left: -20, right: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                                width={80}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                    borderRadius: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                                {platformData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
