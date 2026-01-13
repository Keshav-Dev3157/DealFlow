import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Profile } from "@/types";
import SettingsForm from "@/components/SettingsForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const typedProfile = profile as Profile | null;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 font-sans">
            {/* Minimal Header */}
            <header className="w-full border-b border-border bg-background/50 backdrop-blur-md px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium text-sm transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest hidden sm:block">Settings</span>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12 md:py-20">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-black text-foreground tracking-tight mb-3">Profile Settings</h1>
                    <p className="text-muted-foreground text-base">
                        Update your essential business and payout details.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-2xl">
                    <SettingsForm profile={typedProfile} userEmail={user.email || ""} />
                </div>
            </main>
        </div>
    );
}
