import { createClient } from "@/lib/supabase/server";
import NewDealDialog from "@/components/NewDealDialog";
import KanbanBoard from "@/components/KanbanBoard";
import { Deal, Profile } from "@/types";
import StatsCards from "@/components/StatsCards";
import RevenueChart from "@/components/RevenueChart";
import { LayoutDashboard, LogOut, TrendingUp, Clock, CheckCircle2, Settings, User } from "lucide-react";
import { signOut } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

    const typedProfile = profile as Profile | null;

    const { data: deals, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching deals:", error);
    }

    const typedDeals = (deals as Deal[]) || [];



    const displayName = typedProfile?.full_name || user?.email?.split("@")[0] || "User";

    return (
        <div className="min-h-screen bg-zinc-50/50 selection:bg-indigo-500/30">
            {/* Sticky Glass Header */}
            <header className="sticky top-0 z-30 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <LayoutDashboard className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">
                                DEALFLOW
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">
                                Dashboard &bull; Beta
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <NewDealDialog />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="font-bold text-slate-700 gap-2">
                                    <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                        <User size={14} />
                                    </div>
                                    <span className="hidden sm:inline">{displayName}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-slate-100">
                                <DropdownMenuLabel className="font-bold text-slate-900">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/settings" className="flex items-center gap-2">
                                        <Settings size={14} />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer text-red-600 focus:text-red-600">
                                    <form action={signOut} className="w-full">
                                        <button type="submit" className="flex items-center gap-2 w-full">
                                            <LogOut size={14} />
                                            Sign Out
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8 space-y-10">
                {/* Revenue Stats Bar */}
                {/* Analytics Section */}
                <section>
                    <StatsCards deals={typedDeals} />
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        <RevenueChart deals={typedDeals} />
                    </div>
                </section>

                {typedDeals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[32px] border border-slate-200 shadow-sm text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
                            <LayoutDashboard size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your pipeline is empty</h3>
                        <p className="text-slate-500 max-w-sm mt-3 font-medium">
                            Stop chasing and start tracking. Add your first deal to see your business grow.
                        </p>
                        <div className="mt-8">
                            <NewDealDialog />
                        </div>
                    </div>
                ) : (
                    <KanbanBoard deals={typedDeals} />
                )}
            </main>
        </div>
    );
}
