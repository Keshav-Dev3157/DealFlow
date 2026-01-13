'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { DealStatus } from "@/types";
import { Resend } from 'resend';



export async function createDeal(formData: FormData) {
    try {
        const supabase = await createClient();

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return { error: "You must be logged in to create a deal." };
        }

        const brand_name = formData.get("brand_name") as string;
        const contact_email = formData.get("contact_email") as string;
        const price = parseFloat(formData.get("price") as string);
        const status = formData.get("status") as DealStatus;
        const platform = formData.get("platform") as string || "Instagram";
        const due_date = formData.get("due_date") as string || null;

        const { error } = await supabase.from("deals").insert({
            user_id: user.id,
            brand_name,
            contact_email,
            price,
            status,
            platform,
            due_date,
        });

        if (error) {
            console.error("Error creating deal:", error);
            return { error: "Failed to create deal: " + error.message };
        }

        // Auto-spawn default deliverables
        const { data: newDeal } = await supabase
            .from("deals")
            .select("id")
            .eq("user_id", user.id)
            .eq("brand_name", brand_name)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (newDeal) {
            await supabase.from("deliverables").insert([
                { deal_id: newDeal.id, label: "Draft submitted" },
                { deal_id: newDeal.id, label: "Content posted" },
                { deal_id: newDeal.id, label: "Proof uploaded" },
            ]);
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (e: any) {
        console.error("Unexpected error in createDeal:", e);
        return { error: e.message || "An unexpected error occurred" };
    }
}

export async function updateDealStatus(dealId: string, newStatus: DealStatus) {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "You must be logged in to update a deal." };
    }

    const { error } = await supabase
        .from("deals")
        .update({ status: newStatus })
        .eq("id", dealId)
        .eq("user_id", user.id); // Ensure user owns the deal

    if (error) {
        console.error("Error updating deal status:", error);
        return { error: "Failed to update deal status." };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateDeal(dealId: string, formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "You must be logged in to update a deal." };
    }

    const brand_name = formData.get("brand_name") as string;
    const contact_email = formData.get("contact_email") as string;
    const price = parseFloat(formData.get("price") as string);
    const status = formData.get("status") as DealStatus;
    const platform = formData.get("platform") as string || "Instagram";
    const due_date = formData.get("due_date") as string || null;

    const { error } = await supabase
        .from("deals")
        .update({ brand_name, contact_email, price, status, platform, due_date })
        .eq("id", dealId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating deal:", error);
        return { error: "Failed to update deal." };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteDeal(dealId: string) {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "You must be logged in to delete a deal." };
    }

    const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", dealId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting deal:", error);
        return { error: "Failed to delete deal." };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "You must be logged in to update your profile." };
    }

    const full_name = formData.get("full_name") as string || null;
    const payment_details = formData.get("payment_details") as string || null;
    const instagram_handle = formData.get("instagram_handle") as string || null;
    const tiktok_handle = formData.get("tiktok_handle") as string || null;
    const bank_name = formData.get("bank_name") as string || null;
    const account_number = formData.get("account_number") as string || null;
    const routing_number = formData.get("routing_number") as string || null;
    const revenue_goal = parseFloat(formData.get("revenue_goal") as string) || 0;

    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            full_name,
            payment_details,
            instagram_handle,
            tiktok_handle,
            bank_name,
            account_number,
            routing_number,
            revenue_goal,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile." };
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function sendInvoiceEmail(dealId: string, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in." };
    }

    const recipientEmail = formData.get("email") as string;

    // Fetch deal and profile details for the email content
    const { data: deal } = await supabase
        .from("deals")
        .select("*")
        .eq("id", dealId)
        .single();

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!deal) return { error: "Deal not found." };

    try {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.log("MOCK EMAIL SENT (No API Key):", {
                to: recipientEmail,
                subject: `Invoice from ${profile?.full_name || 'Influencer'}`,
                deal: deal.brand_name,
                price: deal.price
            });
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true };
        }

        const resend = new Resend(apiKey);

        const { error } = await resend.emails.send({
            from: 'VibeFlow <onboarding@resend.dev>', // Use default Resend testing domain
            to: [recipientEmail],
            subject: `Invoice: ${deal.brand_name} Campaign`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4F46E5;">Invoice from ${profile?.full_name || 'Partner'}</h1>
                    <p>Hi,</p>
                    <p>Please find details for the <strong>${deal.brand_name}</strong> campaign invoice below.</p>
                    
                    <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #6B7280; font-size: 12px; text-transform: uppercase; font-weight: bold;">Amount Due</p>
                        <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold; color: #111827;">$${deal.price.toLocaleString()}</p>
                    </div>

                    ${profile?.payment_details ? `
                        <div style="border: 1px solid #E5E7EB; padding: 20px; border-radius: 8px;">
                            <p style="margin: 0 0 10px 0; font-weight: bold;">Payment Details:</p>
                            <p style="white-space: pre-line; margin: 0; color: #4B5563;">${profile.payment_details}</p>
                        </div>
                    ` : ''}

                    <p style="margin-top: 30px; font-size: 14px; color: #6B7280;">
                        Review full invoice: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invoices/${deal.id}
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend error:", error);
            return { error: "Failed to send email." };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Email error:", error);
        return { error: "Something went wrong sending the email." };
    }
}

// DELIVERABLES ACTIONS
export async function addDeliverable(dealId: string, label: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("deliverables").insert({
        deal_id: dealId,
        label,
    });

    if (error) return { error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
}

export async function toggleDeliverable(id: string, completed: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
        .from("deliverables")
        .update({ completed })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateDeliverableProof(id: string, proofUrl: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
        .from("deliverables")
        .update({ proof_url: proofUrl })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteDeliverable(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("deliverables").delete().eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/dashboard");
    return { success: true };
}
