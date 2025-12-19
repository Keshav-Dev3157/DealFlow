'use client'

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/30 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                        Simple Pricing.
                    </h2>
                    <p className="text-xl text-slate-400">
                        Start for free, upgrade when you scale.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="relative p-8 rounded-3xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black">$0</span>
                            <span className="text-slate-400">/month</span>
                        </div>
                        <p className="text-slate-400 mb-8 font-medium">Perfect for creators just starting to work with brands.</p>
                        <Link href="/dashboard">
                            <Button className="w-full h-12 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold mb-8">
                                Get Started Free
                            </Button>
                        </Link>
                        <ul className="space-y-4">
                            {["Unlimited Deals", "Basic Kanban Board", "PDF Invoicing", "1GB Storage"].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-slate-300">
                                    <div className="p-1 rounded-full bg-slate-700 text-white">
                                        <Check size={12} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative p-8 rounded-3xl bg-indigo-600 border border-indigo-500 shadow-2xl shadow-indigo-900/50">
                        <div className="absolute top-0 right-0 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                            POPULAR
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black">$29</span>
                            <span className="text-indigo-200">/month</span>
                        </div>
                        <p className="text-indigo-100 mb-8 font-medium">For established creators running a business.</p>
                        <Button className="w-full h-12 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 font-bold mb-8">
                            Start 14-Day Trial
                        </Button>
                        <ul className="space-y-4">
                            {["Everything in Free", "Advanced Analytics", "Custom Invoice Branding", "Priority Support", "Stripe Integration (Beta)"].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-indigo-500 text-white">
                                        <Check size={12} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
