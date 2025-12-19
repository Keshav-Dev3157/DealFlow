'use client'

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, TrendingUp, DollarSign } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-40 overflow-hidden bg-zinc-950 selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-8">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            Now in Public Beta
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[1] mb-8">
                            The Operating System <br /> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Creators</span>
                        </h1>
                        <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Manage deals, send professional invoices, and track your revenue growth.
                            Stop using spreadsheets and start running a business.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/dashboard">
                                <Button size="lg" className="h-14 px-8 rounded-full text-lg font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all hover:scale-105">
                                    Start for Free <ArrowRight className="ml-2" size={20} />
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button variant="ghost" size="lg" className="h-14 px-8 rounded-full text-lg font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
                                    See how it works
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* 3D Code-Based Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.2, type: "spring" }}
                    className="relative mx-auto max-w-5xl perspective-1000"
                    style={{ perspective: "1000px" }}
                >
                    {/* Main Container */}
                    <div className="relative rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden aspect-[16/9] group">
                        {/* Fake Browser Bar */}
                        <div className="h-10 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>

                        {/* Dashboard Content Grid */}
                        <div className="p-6 grid grid-cols-12 gap-6 h-full bg-zinc-950/50">
                            {/* Left Col: Sidebar */}
                            <div className="col-span-2 hidden md:flex flex-col gap-4 border-r border-zinc-800/50 pr-4">
                                <div className="h-8 w-8 bg-indigo-500 rounded-lg mb-4" />
                                <div className="h-2 w-20 bg-zinc-800 rounded-full" />
                                <div className="h-2 w-16 bg-zinc-800 rounded-full" />
                                <div className="h-2 w-24 bg-zinc-800 rounded-full" />
                            </div>

                            {/* Main Content */}
                            <div className="col-span-12 md:col-span-10 grid grid-cols-12 gap-6">
                                {/* Header */}
                                <div className="col-span-12 flex justify-between items-center mb-4">
                                    <div className="h-8 w-32 bg-zinc-800/50 rounded-lg animate-pulse" />
                                    <div className="h-8 w-8 rounded-full bg-zinc-800/50" />
                                </div>

                                {/* Revenue Chart Card - Floating Animation */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="col-span-12 md:col-span-8 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <div className="text-zinc-500 text-sm font-medium mb-1">Total Revenue</div>
                                            <div className="text-3xl font-bold text-white">$12,450.00</div>
                                        </div>
                                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <TrendingUp size={16} />
                                        </div>
                                    </div>
                                    {/* Abstract Chart Line */}
                                    <svg className="w-full h-24 stroke-indigo-500 stroke-[3] fill-none drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" viewBox="0 0 100 30" preserveAspectRatio="none">
                                        <path d="M0,30 C20,30 20,10 40,15 C60,20 60,5 80,10 C90,12 100,0 100,0" />
                                    </svg>
                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent" />
                                </motion.div>

                                {/* Stats Cards - Staggered Float */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="col-span-6 md:col-span-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 mb-4">
                                        <LayoutDashboard size={16} />
                                    </div>
                                    <div className="text-zinc-500 text-sm mb-1">Active Deals</div>
                                    <div className="text-2xl font-bold text-white">14</div>
                                </motion.div>

                                {/* Kanban Column - Lead */}
                                <div className="col-span-12 md:col-span-4 mt-4 space-y-3">
                                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Lead</div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm"
                                    >
                                        <div className="h-2 w-16 bg-blue-500/50 rounded-full mb-3" />
                                        <div className="h-4 w-24 bg-zinc-700 rounded-md mb-2" />
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="h-6 w-6 rounded-full bg-zinc-700" />
                                            <div className="text-xs text-zinc-500 font-mono">$5,000</div>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm"
                                    >
                                        <div className="h-2 w-16 bg-blue-500/50 rounded-full mb-3" />
                                        <div className="h-4 w-32 bg-zinc-700 rounded-md mb-2" />
                                    </motion.div>
                                </div>

                                {/* Kanban Column - Paid */}
                                <div className="col-span-12 md:col-span-4 mt-4 space-y-3 hidden md:block">
                                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Paid</div>
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        className="p-4 rounded-xl bg-zinc-800/40 border border-emerald-500/30 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                                    >
                                        <div className="h-2 w-16 bg-emerald-500 rounded-full mb-3" />
                                        <div className="h-4 w-20 bg-zinc-700 rounded-md mb-2" />
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="h-6 w-6 rounded-full bg-zinc-700" />
                                            <div className="text-xs text-emerald-400 font-bold font-mono">PAID</div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
