'use client'

import { motion } from "framer-motion";
import { LayoutDashboard, Receipt, TrendingUp, CheckCircle2 } from "lucide-react";

const features = [
    {
        title: "Chaos to Clarity.",
        description: "Stop juggling DMs and spreadsheets. Visualize every active deal in a professional pipeline designed for solo-operators.",
        subfeatures: ["Drag-and-drop Kanban", "Status tracking", "Deal value forecasting"],
        color: "indigo",
        align: "right",
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
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-6 right-6 bg-indigo-600 px-4 py-2 rounded-full text-white text-xs font-bold shadow-lg shadow-indigo-600/50"
                >
                    3 Deals Closing
                </motion.div>
            </div>
        )
    },
    {
        title: "Get Paid Like a Pro.",
        description: "Generate beautiful, itemized invoices in seconds. Track payments and look like the enterprise-grade partner you are.",
        subfeatures: ["PDF Generation", "Payment Tracking", "Custom Terms"],
        color: "violet",
        align: "left",
        visual: (
            <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8 flex flex-col items-center justify-center">
                {/* Visual Mockup: Invoice */}
                <div className="w-3/4 h-[90%] bg-white rounded-xl shadow-2xl p-6 flex flex-col relative transform rotate-[-5deg] transition-transform hover:rotate-0 duration-500">
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
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">PAID</div>
                    </div>
                </div>
                <div className="absolute top-1/2 -right-10 bg-violet-600 p-4 rounded-xl shadow-xl shadow-violet-600/20">
                    <Receipt className="text-white w-8 h-8" />
                </div>
            </div>
        )
    },
    {
        title: "Know Your Worth.",
        description: "Stop guessing your revenue. Real-time analytics show you exactly how your business is growing.",
        subfeatures: ["Revenue Charts", "YoY Growth", "Avg Deal Size"],
        color: "emerald",
        align: "right",
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
        )
    }
];

export default function FeatureSection() {
    return (
        <section id="features" className="py-32 bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-32">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Infrastructure for the <br /> Independent Operator.
                    </h2>
                </div>

                <div className="space-y-40">
                    {features.map((feature, index) => (
                        <FeatureBlock key={index} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureBlock({ feature }: { feature: any }) {
    const isRight = feature.align === "right";

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${isRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
        >
            {/* Text Side */}
            <div className="flex-1 space-y-8">
                <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center border border-${feature.color}-500/20`}>
                    <div className={`w-3 h-3 rounded-full bg-${feature.color}-500`} />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                    {feature.title}
                </h3>
                <p className="text-xl text-zinc-400 leading-relaxed font-light">
                    {feature.description}
                </p>
                <ul className="space-y-3">
                    {feature.subfeatures.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-zinc-300 font-medium">
                            <CheckCircle2 className={`text-${feature.color}-500`} size={20} />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Visual Side */}
            <div className="flex-1 w-full aspect-square md:aspect-[4/3]">
                {feature.visual}
            </div>
        </motion.div>
    );
}
