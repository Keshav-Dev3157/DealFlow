'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';

export async function getPendingApplications() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Re-verify admin status for security
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_admin) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("application_status", "pending")
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching pending applications:", error);
        return [];
    }

    return data;
}

export async function approveApplication(userId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: adminProfile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!adminProfile?.is_admin) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("profiles")
        .update({ application_status: "approved" })
        .eq("id", userId);

    if (error) {
        console.error("Error approving application:", error);
        return { error: "Failed to approve application" };
    }

    // --- Send Welcome Email ---
    try {
        const { data: approvedUser } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", userId)
            .single();

        if (approvedUser?.email) {
            const apiKey = process.env.RESEND_API_KEY;

            if (apiKey) {
                const resend = new Resend(apiKey);
                await resend.emails.send({
                    from: 'VibeFlow <onboarding@resend.dev>',
                    to: [approvedUser.email],
                    subject: 'Welcome to VibeFlow: Access Granted',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #09090b; color: #ffffff;">
                            <div style="background-color: #4f46e5; width: 40px; hieght: 40px; border-radius: 12px; margin-bottom: 24px;"></div>
                            <h1 style="font-size: 32px; font-weight: 800; letter-spacing: -0.05em; margin-bottom: 16px;">Access Granted.</h1>
                            <p style="font-size: 18px; color: #a1a1aa; line-height: 1.6; margin-bottom: 32px;">
                                Hi ${approvedUser.full_name || 'Operator'}, your application to join the VibeFlow private network has been approved. You now have full access to our operating tools.
                            </p>
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                               style="display: inline-block; background-color: #ffffff; color: #09090b; padding: 16px 32px; border-radius: 9999px; font-weight: 700; text-decoration: none; font-size: 16px;">
                                Enter Dashboard
                            </a>
                            <p style="margin-top: 40px; font-size: 14px; color: #52525b;">
                                Welcome to the circle.<br>
                                — The VibeFlow Team
                            </p>
                        </div>
                    `,
                });
            } else {
                console.log("MOCK APPROVAL EMAIL:", approvedUser.email);
            }
        }
    } catch (emailError) {
        console.error("Email notification failed (non-critical):", emailError);
    }

    revalidatePath("/admin");
    return { success: true };
}

export async function rejectApplication(userId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: adminProfile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!adminProfile?.is_admin) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("profiles")
        .update({ application_status: "rejected" })
        .eq("id", userId);

    if (error) {
        console.error("Error rejecting application:", error);
        return { error: "Failed to reject application" };
    }

    revalidatePath("/admin");
    return { success: true };
}
