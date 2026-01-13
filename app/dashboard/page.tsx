import { createClient } from "@/lib/supabase/server";
import { Deal, Profile } from "@/types";
import { LayoutDashboard, LogOut, Settings, User, Shield } from "lucide-react";
import { signOut } from "@/app/auth-actions";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import NewDealDialog from "@/components/NewDealDialog";
import DashboardContent from "@/components/DashboardContent";
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

    // Calculate current month's revenue (Paid deals only)
    const now = new Date();
    const currentMonthDeals = typedDeals.filter(deal => {
        if (deal.status !== 'paid') return false;
        const dealDate = new Date(deal.created_at);
        return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear();
    });
    const currentMonthRevenue = currentMonthDeals.reduce((sum, deal) => sum + deal.price, 0);

    const displayName = typedProfile?.full_name || user?.email?.split("@")[0] || "User";

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
            {/* Sticky Glass Header */}
            <header className="sticky top-0 z-30 w-full border-b border-border bg-background/70 backdrop-blur-xl px-4 md:px-8 py-3 md:py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <LayoutDashboard className="text-white" size={16} />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-foreground tracking-tight leading-tight uppercase italic">
                                VIBEFLOW
                            </h1>
                            <p className="hidden md:block text-[10px] font-bold text-muted-foreground uppercase tracking-widest -mt-0.5">
                                Operating Console
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <NewDealDialog />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 p-1.5 md:p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-bold text-foreground">
                                    <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <User size={14} />
                                    </div>
                                    <span className="hidden sm:inline text-sm">{displayName}</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-border bg-card p-2">
                                <DropdownMenuLabel className="font-bold text-foreground text-xs uppercase tracking-widest px-3 py-3">Operations Hub</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem asChild className="cursor-pointer rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-950/30 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                    <Link href="/settings" className="flex items-center gap-3 py-2 px-1">
                                        <Settings size={16} className="text-muted-foreground" />
                                        <span className="font-medium">Settings & Payouts</span>
                                    </Link>
                                </DropdownMenuItem>
                                {typedProfile?.is_admin && (
                                    <DropdownMenuItem asChild className="cursor-pointer text-indigo-600 dark:text-indigo-400 focus:text-indigo-600 dark:focus:text-indigo-400 font-bold rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-950/30">
                                        <Link href="/admin" className="flex items-center gap-3 py-2 px-1">
                                            <Shield size={16} />
                                            Admin Core
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem asChild className="cursor-pointer text-red-600 focus:text-red-700 rounded-xl focus:bg-red-50 dark:focus:bg-red-950/20">
                                    <form action={signOut} className="w-full">
                                        <button type="submit" className="flex items-center gap-3 w-full py-2 px-1">
                                            <LogOut size={16} />
                                            <span className="font-medium">Terminate Session</span>
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <DashboardContent
                    profile={typedProfile}
                    deals={typedDeals}
                    currentMonthRevenue={currentMonthRevenue}
                />
            </main>
        </div>
    );
}
