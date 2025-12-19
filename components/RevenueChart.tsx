'use client'

import { Deal } from "@/types";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueChartProps {
    deals: Deal[];
}

export default function RevenueChart({ deals }: RevenueChartProps) {
    // Group "paid" deals by month
    const monthlyData = deals
        .filter(d => d.status === "paid")
        .reduce((acc, deal) => {
            const date = new Date(deal.created_at); // In real app, use paid_at date if available
            const month = date.toLocaleString('default', { month: 'short' });

            const existing = acc.find(item => item.name === month);
            if (existing) {
                existing.total += deal.price;
            } else {
                acc.push({ name: month, total: deal.price });
            }
            return acc;
        }, [] as { name: string; total: number }[]);

    // Sort logic needs to be robust for months, but for MVP assuming chronological creation is roughly chronological
    // Ideally we sort by month index. But since we lack 'paid_at', this is an approximation.
    // If no data, show empty state or placeholder data
    const data = monthlyData.length > 0 ? monthlyData : [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: 0 },
        { name: "Jun", total: 0 },
    ];

    return (
        <Card className="col-span-4 rounded-2xl border-none shadow-md bg-white/50 backdrop-blur-sm mb-8 lg:mb-0">
            <CardHeader>
                <CardTitle className="text-lg font-black text-slate-900">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value: number) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                cursor={{ stroke: "#4F46E5", strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#4F46E5"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
