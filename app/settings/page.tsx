import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Profile } from "@/types";
import SettingsForm from "@/components/SettingsForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="min-h-screen bg-zinc-50/50">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl px-8 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">
                        Settings
                    </h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-8">
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Profile Settings</h2>
                    <p className="text-slate-500 mb-8">
                        Update your details for invoices and billing.
                    </p>

                    <SettingsForm profile={typedProfile} userEmail={user.email || ""} />
                </div>
            </main>
        </div>
    );
}
