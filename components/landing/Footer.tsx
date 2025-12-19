'use client'

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <LayoutDashboard size={16} />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">DealFlow</span>
                    </div>

                    <div className="flex items-center gap-8 text-sm font-medium">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-white transition-colors">Support</Link>
                    </div>

                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} DealFlow. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
