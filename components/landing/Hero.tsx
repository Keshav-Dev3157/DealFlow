'use client'

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, TrendingUp } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background selection:bg-primary/30">
            {/* Elegant Background - Smoother Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Minimalist Copy */}
                    <div className="text-left relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary border border-border backdrop-blur-md text-muted-foreground text-sm font-bold mb-8 hover:bg-secondary/80 transition-colors cursor-default uppercase tracking-widest">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                MEMBERS ONLY
                            </div>

                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tighter leading-[0.9] mb-8 uppercase italic">
                                Operate <br />
                                <span className="text-muted-foreground/60">in Private.</span>
                            </h1>

                            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg font-medium">
                                The operating network for creators who treat their business as an asset class. No agencies. No noise. Just control.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link href="/apply">
                                    <Button size="lg" className="h-14 px-8 rounded-full text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-primary/10">
                                        Request Access <ArrowRight className="ml-2" size={18} />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="ghost" className="h-14 px-8 rounded-full text-base font-bold text-foreground hover:bg-secondary transition-all duration-300">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Abstract / Premium Visual */}
                    <div className="relative h-[800px] hidden lg:block perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, rotateX: 10, z: -100 }}
                            animate={{ opacity: 1, rotateX: 0, z: 0 }}
                            transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0 }}
                            className="relative w-full h-full"
                        >
                            {/* Glass Card - Main Dashboard Interface */}
                            <div className="absolute top-[10%] right-0 w-full h-[70%] bg-card border border-border rounded-[32px] shadow-2xl p-8 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />

                                {/* UI Mockup Internals */}
                                <div className="flex items-center justify-between mb-8 opacity-50">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-border" />
                                        <div className="w-3 h-3 rounded-full bg-border" />
                                    </div>
                                    <div className="h-2 w-20 bg-border rounded-full" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-secondary/50 border border-border">
                                        <div className="text-muted-foreground text-[10px] font-black uppercase tracking-wider mb-2">Revenue (YTD)</div>
                                        <div className="text-4xl font-mono text-foreground font-black mb-2">$142,000</div>
                                        <div className="flex items-center text-emerald-500 text-sm font-bold gap-1">
                                            <TrendingUp size={14} /> +24%
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
                                        <div className="text-primary text-[10px] font-black uppercase tracking-wider mb-2">Active Contracts</div>
                                        <div className="text-4xl font-mono text-foreground font-black mb-2">8</div>
                                        <div className="text-primary/60 text-sm font-bold">3 Closing this week</div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-12 right-12 p-4 rounded-2xl bg-card border border-border shadow-xl w-64 z-20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black">
                                            $
                                        </div>
                                        <div>
                                            <div className="text-foreground font-black text-sm">Payment Received</div>
                                            <div className="text-muted-foreground text-xs font-bold leading-tight">$4,500 from Nike</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Decorative Blur Circles Behind */}
                            <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full z-[-1]" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
