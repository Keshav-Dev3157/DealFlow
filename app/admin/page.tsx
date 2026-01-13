'use client';

import { useEffect, useState } from 'react';
import { getPendingApplications, approveApplication, rejectApplication } from './actions';
import { Button } from '@/components/ui/button';
import {
    Check,
    X,
    Loader2,
    Users,
    TrendingUp,
    Instagram,
    Globe,
    Shield,
    Search,
    Filter,
    ArrowUpRight,
    ExternalLink
} from 'lucide-react';
import { Profile } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const [applications, setApplications] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getPendingApplications();
            setApplications(data as Profile[]);
        } catch (error) {
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, name: string) => {
        setActionLoading(id);
        const res = await approveApplication(id);
        if (res.success) {
            setApplications(prev => prev.filter(app => app.id !== id));
            toast.success(`Approved ${name}`);
        } else {
            toast.error(res.error || "Approval failed");
        }
        setActionLoading(null);
    };

    const handleReject = async (id: string, name: string) => {
        setActionLoading(id);
        const res = await rejectApplication(id);
        if (res.success) {
            setApplications(prev => prev.filter(app => app.id !== id));
            toast.success(`Rejected ${name}`);
        } else {
            toast.error(res.error || "Rejection failed");
        }
        setActionLoading(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-t-2 border-primary animate-spin" />
                    <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/70" size={16} />
                </div>
                <p className="text-muted-foreground font-medium animate-pulse">Syncing encrypted data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-500 text-xs font-black tracking-widest uppercase">Operational Console</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight uppercase italic">{`Application Protocol`}</h1>
                        <p className="text-muted-foreground font-medium mt-1">VibeFlow Private Network Admission</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-foreground font-black text-2xl">{applications.length}</span>
                            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Pending Review</span>
                        </div>
                        <div className="h-10 w-px bg-border" />
                        <div className="bg-primary/10 border border-primary/20 p-2 rounded-xl">
                            <Shield className="text-primary" size={24} />
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                {applications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32 bg-secondary/20 rounded-[40px] border border-border border-dashed"
                    >
                        <div className="h-20 w-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                            <Users size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight uppercase italic">Queue Cleared</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">
                            No pending operator requests at this time. All systems optimal.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {applications.map((app) => (
                                <motion.div
                                    layout
                                    key={app.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group bg-card border border-border rounded-[32px] overflow-hidden flex flex-col hover:border-primary/30 transition-all duration-500 p-8 shadow-sm hover:shadow-xl"
                                >
                                    {/* Application Meta */}
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20 uppercase italic">
                                                {app.full_name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="text-foreground font-bold text-xl tracking-tight leading-tight">{app.full_name || "Nexus User"}</h3>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Operator Request</span>
                                                    <span className="text-muted-foreground/30">•</span>
                                                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Pending</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-secondary/30 rounded-2xl p-4 border border-border">
                                            <div className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <TrendingUp size={10} className="text-primary" />
                                                Deal Velocity
                                            </div>
                                            <div className="text-foreground font-mono font-bold text-lg">{app.brand_deals_count || 'N/A'}</div>
                                        </div>
                                        <div className="bg-secondary/30 rounded-2xl p-4 border border-border">
                                            <div className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                Max Volume
                                            </div>
                                            <div className="text-foreground font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">{app.biggest_deal_size || 'N/A'}</div>
                                        </div>
                                    </div>

                                    {/* Connectivity/Socials */}
                                    <div className="flex-1 mb-8">
                                        <h4 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-4">Digital Presence</h4>
                                        <div className="space-y-3">
                                            {app.instagram_handle && (
                                                <div className="flex items-center justify-between text-foreground bg-secondary/50 rounded-xl px-4 py-2.5 border border-border group/link cursor-pointer hover:bg-secondary transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <Instagram size={14} className="text-pink-500" />
                                                        <span className="text-sm font-medium tracking-tight">@{app.instagram_handle}</span>
                                                    </div>
                                                    <ExternalLink size={12} className="text-muted-foreground group-hover/link:text-foreground transition-colors" />
                                                </div>
                                            )}
                                            {app.tiktok_handle && (
                                                <div className="flex items-center justify-between text-foreground bg-secondary/50 rounded-xl px-4 py-2.5 border border-border group/link cursor-pointer hover:bg-secondary transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3.5 h-3.5 flex items-center justify-center bg-foreground rounded-full"><span className="text-background text-[9px] font-black">T</span></div>
                                                        <span className="text-sm font-medium tracking-tight">@{app.tiktok_handle}</span>
                                                    </div>
                                                    <ExternalLink size={12} className="text-muted-foreground group-hover/link:text-foreground transition-colors" />
                                                </div>
                                            )}
                                            {!app.instagram_handle && !app.tiktok_handle && (
                                                <div className="text-muted-foreground text-xs italic bg-secondary/30 rounded-xl px-4 py-3 border border-dashed border-border text-center">
                                                    No social handles provided for validation.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Matrix */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            onClick={() => handleReject(app.id, app.full_name || 'Operator')}
                                            disabled={!!actionLoading}
                                            variant="ghost"
                                            className="h-14 rounded-2xl bg-secondary/50 border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 font-bold transition-all duration-300"
                                        >
                                            <X size={18} className="mr-2" />
                                            Dismiss
                                        </Button>
                                        <Button
                                            onClick={() => handleApprove(app.id, app.full_name || 'Operator')}
                                            disabled={!!actionLoading}
                                            className="h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xl shadow-primary/10 transition-all duration-300"
                                        >
                                            {actionLoading === app.id ? (
                                                <Loader2 className="animate-spin" size={18} />
                                            ) : (
                                                <>Approve <Check className="ml-2" size={18} /></>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Background Aesthetic */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full opacity-50" />
            </div>
        </div>
    );
}
