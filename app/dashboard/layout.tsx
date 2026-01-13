import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Profile } from "@/types";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("application_status, is_admin")
        .eq("id", user.id)
        .single();

    // Re-verify type for local safety
    const application_status = profile?.application_status;
    const is_admin = profile?.is_admin;

    if (!is_admin && application_status !== 'approved') {
        redirect("/submitted");
    }

    return (
        <>
            {children}
        </>
    );
}
