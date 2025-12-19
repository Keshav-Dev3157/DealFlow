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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Email</Label>
                <Input
                    id="email"
                    value={userEmail}
                    disabled
                    className="rounded-xl border-slate-200 bg-slate-100 text-slate-500"
                />
                <p className="text-xs text-slate-400 ml-1">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="full_name" className="text-slate-700 font-bold ml-1">Full Name</Label>
                <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={profile?.full_name || ""}
                    placeholder="Your name (shown on invoices)"
                    className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="payment_details" className="text-slate-700 font-bold ml-1">Payment Details</Label>
                <Textarea
                    id="payment_details"
                    name="payment_details"
                    defaultValue={profile?.payment_details || ""}
                    placeholder="Bank account, PayPal, Venmo, etc.&#10;This will appear on your invoices."
                    rows={4}
                    className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50 resize-none"
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all h-12"
            >
                {isSubmitting && <Loader2 size={18} className="animate-spin mr-2" />}
                {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}
