'use client'

import { useState, useEffect } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { sendInvoiceEmail } from "@/app/actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Deal } from "@/types";

interface SendInvoiceDialogProps {
    deal: Deal;
}

export default function SendInvoiceDialog({ deal }: SendInvoiceDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const result = await sendInvoiceEmail(deal.id, formData);

        if (result?.error) {
            toast.error(result.error);
            setIsSubmitting(false);
        } else {
            toast.success("Invoice sent successfully!");
            setIsOpen(false);
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 gap-2">
                    <Mail size={16} />
                    Send to Brand
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl bg-white/95 backdrop-blur-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Send Invoice</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Email this invoice directly to the brand contact.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Recipient Email</Label>
                            <Input
                                required
                                type="email"
                                id="email"
                                name="email"
                                defaultValue={deal.contact_email}
                                className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50"
                            />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600">
                            <p className="font-bold text-slate-900 mb-1">Preview Message:</p>
                            &quot;Hi, please find attached the invoice for {deal.brand_name} campaign. Payment is due by {mounted && deal.due_date ? new Date(deal.due_date).toLocaleDateString() : '30 days'}.&quot;
                        </div>
                    </div>

                    <DialogFooter className="pt-4 flex gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 rounded-xl text-slate-500 font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all"
                        >
                            {isSubmitting ? (
                                <Loader2 size={18} className="animate-spin mr-2" />
                            ) : (
                                <Send size={18} className="mr-2" />
                            )}
                            {isSubmitting ? "Sending..." : "Send Email"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
