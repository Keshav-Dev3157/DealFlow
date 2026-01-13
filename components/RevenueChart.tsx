'use client'

import { Deal } from "@/types";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface RevenueChartProps {
    deals: Deal[];
}

export default function RevenueChart({ deals }: RevenueChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    // Group "paid" deals by month
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyData = deals
        .filter(d => d.status === "paid")
        .reduce((acc, deal) => {
            const date = new Date(deal.created_at);
            const month = date.toLocaleString('default', { month: 'short' });

            const existing = acc.find(item => item.name === month);
            if (existing) {
                existing.total += deal.price;
            } else {
                acc.push({ name: month, total: deal.price, monthIndex: date.getMonth(), year: date.getFullYear() });
            }
            return acc;
        }, [] as { name: string; total: number; monthIndex: number; year: number }[])
        .sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.monthIndex - b.monthIndex;
        });

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
        <Card className="col-span-4 rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
                <CardTitle className="text-lg font-black text-foreground">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[250px] w-full">
                    {!mounted ? (
                        <div className="w-full h-full bg-secondary animate-pulse rounded-2xl" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                                <XAxis
                                    dataKey="name"
                                    stroke="currentColor"
                                    className="text-muted-foreground"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="currentColor"
                                    className="text-muted-foreground"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value: number) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "16px",
                                        border: "1px solid hsl(var(--border))",
                                        backgroundColor: "hsl(var(--card))",
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                    }}
                                    itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                                    labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "12px", marginBottom: "4px" }}
                                    cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
