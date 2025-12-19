'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { updateDeal } from "@/app/actions";
import { Deal, DealStatus } from "@/types";
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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        formData.append("status", status);

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
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Pencil size={14} />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl bg-white/95 backdrop-blur-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Edit Deal</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Update the details for {deal.brand_name}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand_name" className="text-slate-700 font-bold ml-1">Brand Name</Label>
                            <Input
                                required
                                id="brand_name"
                                name="brand_name"
                                defaultValue={deal.brand_name}
                                className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact_email" className="text-slate-700 font-bold ml-1">Contact Email</Label>
                            <Input
                                required
                                type="email"
                                id="contact_email"
                                name="contact_email"
                                defaultValue={deal.contact_email}
                                className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-slate-700 font-bold ml-1">Price ($)</Label>
                                <Input
                                    required
                                    type="number"
                                    id="price"
                                    name="price"
                                    defaultValue={deal.price}
                                    className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold ml-1">Status</Label>
                                <Select value={status} onValueChange={(v) => setStatus(v as DealStatus)}>
                                    <SelectTrigger className="rounded-xl border-slate-200 focus:ring-indigo-500 bg-slate-50/50">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                        <SelectItem value="lead">Lead</SelectItem>
                                        <SelectItem value="working">Working</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="due_date" className="text-slate-700 font-bold ml-1">Due Date</Label>
                            <Input
                                type="date"
                                id="due_date"
                                name="due_date"
                                defaultValue={deal.due_date || ""}
                                className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50"
                            />
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
                            {isSubmitting && <Loader2 size={18} className="animate-spin mr-2" />}
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
