'use client'

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { updateProfile } from "@/app/actions";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SettingsFormProps {
    profile: Profile | null;
    userEmail: string;
}

export default function SettingsForm({ profile, userEmail }: SettingsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const result = await updateProfile(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Profile updated!");
        }

        setIsSubmitting(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Commercial Profile */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-4">Commercial Identity</h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-muted-foreground text-sm font-bold ml-1">Legal / Brand Name</Label>
                    <Input
                        id="full_name"
                        name="full_name"
                        defaultValue={profile?.full_name || ""}
                        placeholder="Your full name for professional invoices"
                        className="h-12 bg-background border-input focus:border-primary text-foreground rounded-xl placeholder:text-muted-foreground/50 transition-all font-medium"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="instagram_handle" className="text-muted-foreground text-sm font-bold ml-1">Instagram</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">@</span>
                            <Input
                                id="instagram_handle"
                                name="instagram_handle"
                                defaultValue={profile?.instagram_handle || ""}
                                placeholder="username"
                                className="h-12 bg-background border-input focus:border-primary text-foreground rounded-xl pl-10 placeholder:text-muted-foreground/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tiktok_handle" className="text-muted-foreground text-sm font-bold ml-1">TikTok</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">@</span>
                            <Input
                                id="tiktok_handle"
                                name="tiktok_handle"
                                defaultValue={profile?.tiktok_handle || ""}
                                placeholder="username"
                                className="h-12 bg-background border-input focus:border-primary text-foreground rounded-xl pl-10 placeholder:text-muted-foreground/50 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Infrastructure */}
            <div className="pt-8 border-t border-border space-y-6">
                <div>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-4">Financial Vault</h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bank_name" className="text-muted-foreground text-sm font-bold ml-1">Institutional Partner</Label>
                    <Input
                        id="bank_name"
                        name="bank_name"
                        defaultValue={profile?.bank_name || ""}
                        placeholder="e.g. Chase, Mercury, Barclays"
                        className="h-12 bg-background border-input focus:border-primary text-foreground rounded-xl placeholder:text-muted-foreground/50 transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="account_number" className="text-muted-foreground text-sm font-bold ml-1">Account reference</Label>
                        <Input
                            id="account_number"
                            name="account_number"
                            defaultValue={profile?.account_number || ""}
                            placeholder="Account Number"
                            className="h-12 bg-background border-input focus:border-primary text-foreground rounded-xl placeholder:text-muted-foreground/50 transition-all font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="routing_number" className="text-muted-foreground text-sm font-bold ml-1">Routing / SWIFT Protocol</Label>
                        <Input
                            id="routing_number"
                            name="routing_number"
                            defaultValue={profile?.routing_number || ""}
                            placeholder="Routing or IFSC Code"
                            className="h-12 bg-background border-input focus:border-primary text-foreground rounded-xl placeholder:text-muted-foreground/50 transition-all font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="payment_details" className="text-muted-foreground text-sm font-bold ml-1">Additional Instructions</Label>
                    <Textarea
                        id="payment_details"
                        name="payment_details"
                        defaultValue={profile?.payment_details || ""}
                        placeholder="PayPal, Venmo, or special clearing instructions..."
                        rows={3}
                        className="bg-background border-input focus:border-primary text-foreground rounded-xl placeholder:text-muted-foreground/50 transition-all resize-none p-4"
                    />
                </div>
            </div>

            {/* Performance Benchmarks */}
            <div className="pt-8 border-t border-border space-y-6">
                <div>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-4">Performance Benchmarks</h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="revenue_goal" className="text-muted-foreground text-sm font-bold ml-1">Monthly Revenue Goal ($)</Label>
                    <Input
                        id="revenue_goal"
                        name="revenue_goal"
                        type="number"
                        defaultValue={profile?.revenue_goal || 0}
                        placeholder="e.g. 5000"
                        className="h-12 bg-background border-input focus:border-primary text-foreground rounded-xl placeholder:text-muted-foreground/50 transition-all font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground/70 ml-1 italic">
                        Sets the target for your dashboard goal tracker.
                    </p>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:opacity-90 text-primary-foreground font-black uppercase tracking-widest rounded-xl shadow-xl active:scale-[0.98] transition-all h-14 text-sm"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Committing Changes...
                    </>
                ) : (
                    "Save & Sync Profile"
                )}
            </Button>
        </form>
    );
}
