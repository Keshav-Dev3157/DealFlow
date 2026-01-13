'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !user) {
        return { error: error?.message || "Login failed" };
    }

    // Check if admin for direct redirection
    // We must use user.id, as email is not in the profiles table (it's in auth.users)
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    revalidatePath("/", "layout");

    if (profile?.is_admin) {
        redirect("/admin");
    } else {
        redirect("/dashboard");
    }
}


export async function submitApplication(formData: FormData) {
    const supabase = await createClient();

    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const full_name = formData.get("full_name") as string;

    // New social fields
    const instagram = formData.get("instagram") as string;
    const tiktok = formData.get("tiktok") as string;
    const youtube = formData.get("youtube") as string;
    const website = formData.get("website") as string;

    const brand_deals_count = formData.get("brand_deals_count") as string;
    const biggest_deal_size = formData.get("biggest_deal_size") as string;
    const is_agency_represented = formData.get("is_agency_represented") === "on";

    // Consolidate social handles for generic summary
    const socialSummary = [
        instagram ? `IG: ${instagram}` : '',
        tiktok ? `TT: ${tiktok}` : '',
        youtube ? `YT: ${youtube}` : '',
        website ? `Web: ${website}` : ''
    ].filter(Boolean).join(', ');

    try {
        // 0. Safeguard: If a user is already logged in, sign them out.
        // This prevents "identity leakage" when testing on the same machine.
        const { data: { user: existingUser } } = await supabase.auth.getUser();
        if (existingUser) {
            await supabase.auth.signOut();
        }

        // 1. Create Auth User AND Profile via Trigger
        // We pass all data to metadata so the Trigger can insert it securely
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    social_handle: socialSummary,
                    instagram_handle: instagram || null,
                    tiktok_handle: tiktok || null,
                    brand_deals_count,
                    biggest_deal_size,
                    is_agency_represented
                },
            },
        });

        if (authError) {
            console.error("Auth Error:", authError);
            return { error: authError.message };
        }

        if (!authData.user) {
            console.error("No user returned from signUp (Account might already exist)");
            return { error: "Could not create account. Email might already be registered." };
        }
    } catch (e) {
        console.error("Unexpected Error:", e);
        return { error: "An unexpected error occurred. Please try again." };
    }

    revalidatePath("/", "layout");
    redirect("/submitted");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}
