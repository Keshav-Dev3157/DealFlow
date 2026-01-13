'use client';

import React, { useRef } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { LayoutDashboard, Receipt, TrendingUp, CheckCircle2 } from "lucide-react";

const content = [
    {
        title: "Chaos to Clarity.",
        description:
            "Visualize every active deal in a professional pipeline.",
        subfeatures: ["Drag-and-drop Kanban", "Status tracking", "Deal value forecasting"],
        color: "indigo",
        visual: (
            <div className="relative w-full h-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col gap-4">
                {/* Visual Mockup: Kanban */}
                <div className="flex justify-between items-center mb-2">
                    <div className="text-zinc-500 text-xs font-bold uppercase">Pipeline</div>
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-900" />
                        <div className="w-6 h-6 rounded-full bg-zinc-600 border border-zinc-900" />
                    </div>
                </div>
                <div className="flex gap-4 h-full">
                    <div className="flex-1 bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
                        <div className="w-20 h-2 bg-yellow-500/20 rounded-full mb-3" />
                        <div className="w-full h-24 bg-zinc-800/50 rounded-lg mb-2" />
                        <div className="w-full h-24 bg-zinc-800/50 rounded-lg" />
                    </div>
                    <div className="flex-1 bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
                        <div className="w-20 h-2 bg-blue-500/20 rounded-full mb-3" />
                        <div className="w-full h-32 bg-zinc-800/50 rounded-lg border-l-2 border-blue-500" />
                    </div>
                </div>
                {/* Floating Tag */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute bottom-6 right-6 bg-indigo-600 px-4 py-2 rounded-full text-white text-xs font-bold shadow-lg shadow-indigo-600/50"
                >
                    3 Deals Closing
                </motion.div>
            </div>
        ),
    },
    {
        title: "Get Paid Like a Pro.",
        description:
            "Generate beautiful, itemized invoices in seconds.",
        subfeatures: ["PDF Generation", "Payment Tracking", "Custom Terms"],
        color: "violet",
        visual: (
            <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8 flex flex-col items-center justify-center">
                {/* Visual Mockup: Invoice */}
                <div className="w-3/4 h-[90%] bg-white rounded-xl shadow-2xl p-6 flex flex-col relative transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <div className="h-6 w-6 bg-black rounded-md" />
                        <div className="text-zinc-950 font-mono font-bold">INVOICE #001</div>
                    </div>
                    <div className="h-4 w-32 bg-zinc-100 rounded mb-2" />
                    <div className="h-4 w-20 bg-zinc-100 rounded mb-8" />

                    <div className="mt-auto border-t pt-4 flex justify-between items-end">
                        <div>
                            <div className="text-xs text-zinc-400">Total Due</div>
                            <div className="text-2xl font-black text-zinc-900">$12,500.00</div>
                        </div>
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                            PAID
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/2 -right-10 bg-violet-600 p-4 rounded-xl shadow-xl shadow-violet-600/20">
                    <Receipt className="text-white w-8 h-8" />
                </div>
            </div>
        ),
    },
    {
        title: "Know Your Worth.",
        description:
            "Real-time analytics show exactly how you're growing.",
        subfeatures: ["Revenue Charts", "YoY Growth", "Avg Deal Size"],
        color: "emerald",
        visual: (
            <div className="relative w-full h-full bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col">
                {/* Visual Mockup: Charts */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="text-zinc-500 text-sm">Monthly Revenue</div>
                        <div className="text-5xl font-black text-white">$42k</div>
                    </div>
                    <div className="flex gap-1 text-emerald-400 font-bold items-center bg-emerald-400/10 px-2 py-1 rounded-lg">
                        <TrendingUp size={16} /> +18%
                    </div>
                </div>
                <div className="flex items-end gap-2 h-40 mt-auto">
                    {[40, 65, 50, 80, 55, 90, 100].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="flex-1 bg-zinc-800 hover:bg-emerald-500 transition-colors rounded-t-sm"
                        />
                    ))}
                </div>
            </div>
        ),
    },
];

export default function StickyScrollReveal() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    const [activeCard, setActiveCard] = React.useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Simple logic to detect which card is active based on scroll percentage
        // 3 cards => 0-0.33, 0.33-0.66, 0.66-1
        const cardLength = content.length;
        const progress = latest * cardLength;
        const index = Math.floor(progress); // 0, 1, 2...

        // Clamp index to valid range
        const clampedIndex = Math.min(Math.max(index, 0), cardLength - 1);

        if (clampedIndex !== activeCard) {
            setActiveCard(clampedIndex);
        }
    });

    return (
        <section ref={ref} className="relative h-[300vh] bg-zinc-950">

            {/* Sticky Visual Container */}
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden z-0">

                {/* Background Ambient Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            background: `radial-gradient(circle at 50% 50%, ${activeCard === 0 ? 'rgba(79, 70, 229, 0.15)' : activeCard === 1 ? 'rgba(124, 58, 237, 0.15)' : 'rgba(16, 185, 129, 0.15)'} 0%, transparent 60%)`
                        }}
                        transition={{ duration: 1 }}
                        className="w-full h-full"
                    />
                </div>

                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center h-full">
                    {/* Left Col: Spacer for text (invisible here, just takes up space in the grid structure if needed, but we're doing absolute positioning for text so this is mainly for the right col alignment) */}
                    <div className="hidden lg:block" />

                    {/* Right Col: The Sticky Visual */}
                    <div className="w-full h-[40vh] lg:h-[500px] relative">
                        {content.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0,
                                    scale: activeCard === index ? 1 : 0.8,
                                    filter: activeCard === index ? "blur(0px)" : "blur(10px)",
                                    zIndex: activeCard === index ? 10 : 0
                                }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                {item.visual}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scrolling Text Content */}
            <div className="absolute top-0 w-full z-[9999]">
                {content.map((item, index) => (
                    <div key={index} className="h-screen flex items-center justify-center lg:justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
                        <div className="w-full lg:w-1/2 pointer-events-auto">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800/50 shadow-2xl"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center border border-${item.color}-500/20 mb-6`}>
                                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
                                    {item.title}
                                </h3>
                                <p className="text-xl text-zinc-400 leading-relaxed font-light mb-8">
                                    {item.description}
                                </p>
                                <ul className="space-y-3">
                                    {item.subfeatures.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-300 font-medium">
                                            <CheckCircle2 className={`text-${item.color}-500`} size={20} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
