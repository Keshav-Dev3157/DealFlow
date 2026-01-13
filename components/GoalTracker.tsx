'use client'

import { motion } from "framer-motion";
import { Target, TrendingUp, Sparkles } from "lucide-react";

interface GoalTrackerProps {
    currentRevenue: number;
    goal: number;
}

export default function GoalTracker({ currentRevenue, goal }: GoalTrackerProps) {
    const percentage = goal > 0 ? Math.min((currentRevenue / goal) * 100, 100) : 0;
    const isComplete = percentage >= 100;

    return (
        <div className="bg-card border border-border rounded-3xl p-4 md:p-6 relative overflow-hidden shadow-lg shadow-primary/5">
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                    <h3 className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Target size={14} className="text-primary" />
                        Monthly Objective
                    </h3>
                    <p className="text-xl md:text-2xl font-black text-foreground mt-1 tracking-tight">
                        ${currentRevenue.toLocaleString()}
                        <span className="text-muted-foreground/40 text-xs md:text-sm font-bold ml-2">/ ${goal.toLocaleString()}</span>
                    </p>
                </div>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${isComplete ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                    {isComplete ? <Sparkles size={24} /> : <TrendingUp size={24} />}
                </div>
            </div>

            <div className="relative h-4 bg-secondary/50 rounded-full overflow-hidden border border-border/50">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${isComplete
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-gradient-to-r from-primary to-indigo-400'
                        }`}
                />
            </div>

            <div className="flex justify-between mt-4">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    {percentage.toFixed(1)}% ACHIEVED
                </p>
                <p className="text-[10px] font-black uppercase text-primary tracking-widest">
                    {goal - currentRevenue > 0 ? `$${(goal - currentRevenue).toLocaleString()} TO GO` : 'GOAL SMASHED'}
                </p>
            </div>

            {/* Background Aesthetic Glow */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[80px] rounded-full transition-colors ${isComplete ? 'bg-emerald-500/20' : 'bg-primary/20'}`} />
        </div>
    );
}
