'use client'

import { LayoutDashboard, TrendingUp, Receipt, Bell } from "lucide-react";

const features = [
    {
        title: "Visual Deal Pipeline",
        description: "Stop using spreadsheets. Drag and drop deals through stages from 'Lead' to 'Paid' with our intuitive Kanban board.",
        icon: <LayoutDashboard className="w-6 h-6 text-white" />,
        color: "bg-indigo-600"
    },
    {
        title: "Professional Invoicing",
        description: "Create and send PDF invoices in seconds. Your brand, your terms. Get paid faster with professional templates.",
        icon: <Receipt className="w-6 h-6 text-white" />,
        color: "bg-violet-600"
    },
    {
        title: "Revenue Analytics",
        description: "Know exactly how much you're making. Track monthly growth, average deal size, and pipeline value.",
        icon: <TrendingUp className="w-6 h-6 text-white" />,
        color: "bg-emerald-600"
    },
    {
        title: "Smart Notifications",
        description: "Never miss a deadline. Get automated reminders for due dates and follow-ups with brands.",
        icon: <Bell className="w-6 h-6 text-white" />,
        color: "bg-amber-600"
    }
];

export default function FeatureSection() {
    return (
        <section id="features" className="py-32 bg-zinc-950 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Everything you need to <br /> run your business.
                    </h2>
                    <p className="text-xl text-zinc-400">
                        DealFlow replaces your fragmented toolset satisfying the needs of modern creators.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all duration-300 group">
                            <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-indigo-900/20 rotate-3 group-hover:rotate-6 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
