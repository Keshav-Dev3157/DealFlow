'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { updateDeal } from "@/app/actions";
import { Deal, DealStatus } from "@/types";
import DeliverablesList from "./DeliverablesList";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EditDealDialogProps {
    deal: Deal;
    onUpdate?: () => void;
}

export default function EditDealDialog({ deal, onUpdate }: EditDealDialogProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<DealStatus>(deal.status);
    const [platform, setPlatform] = useState(deal.platform || "Instagram");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        formData.append("status", status);
        formData.append("platform", platform);

        const result = await updateDeal(deal.id, formData);

        if (result?.error) {
            toast.error(result.error);
            setIsSubmitting(false);
        } else {
            toast.success("Deal updated!");
            setIsOpen(false);
            setIsSubmitting(false);
            router.refresh(); // Refresh data to move card to new column
            onUpdate?.();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Pencil size={14} />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] rounded-3xl border border-border shadow-2xl bg-card/95 backdrop-blur-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-foreground tracking-tight">Edit Deal</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Update the details for {deal.brand_name}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand_name" className="text-foreground font-bold ml-1">Brand Name</Label>
                            <Input
                                required
                                id="brand_name"
                                name="brand_name"
                                defaultValue={deal.brand_name}
                                className="rounded-xl border-border focus-visible:ring-indigo-500 bg-secondary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact_email" className="text-foreground font-bold ml-1">Contact Email</Label>
                            <Input
                                required
                                type="email"
                                id="contact_email"
                                name="contact_email"
                                defaultValue={deal.contact_email}
                                className="rounded-xl border-border focus-visible:ring-indigo-500 bg-secondary/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-foreground font-bold ml-1">Price ($)</Label>
                                <Input
                                    required
                                    type="number"
                                    id="price"
                                    name="price"
                                    defaultValue={deal.price}
                                    className="rounded-xl border-border focus-visible:ring-indigo-500 bg-secondary/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-foreground font-bold ml-1">Status</Label>
                                <Select value={status} onValueChange={(v) => setStatus(v as DealStatus)}>
                                    <SelectTrigger className="rounded-xl border-border focus:ring-indigo-500 bg-secondary/50">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border shadow-xl bg-card">
                                        <SelectItem value="lead">Lead</SelectItem>
                                        <SelectItem value="working">Working</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label className="text-foreground font-bold ml-1">Platform</Label>
                                <Select value={platform} onValueChange={setPlatform}>
                                    <SelectTrigger className="rounded-xl border-border focus:ring-indigo-500 bg-secondary/50">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border shadow-xl bg-card">
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                        <SelectItem value="TikTok">TikTok</SelectItem>
                                        <SelectItem value="YouTube">YouTube</SelectItem>
                                        <SelectItem value="Twitter">Twitter / X</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="due_date" className="text-foreground font-bold ml-1">Due Date</Label>
                                <Input
                                    type="date"
                                    id="due_date"
                                    name="due_date"
                                    defaultValue={deal.due_date || ""}
                                    className="rounded-xl border-border focus-visible:ring-indigo-500 bg-secondary/50 text-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 flex gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 rounded-xl text-muted-foreground font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all"
                        >
                            {isSubmitting && <Loader2 size={18} className="animate-spin mr-2" />}
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>

                <div className="px-4 pb-6">
                    <DeliverablesList dealId={deal.id} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
