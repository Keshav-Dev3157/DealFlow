'use client'

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createDeal } from "@/app/actions";
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

export default function NewDealDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState("lead");
    const [platform, setPlatform] = useState("Instagram");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        formData.append("status", status); // Since Shadcn Select is controlled
        formData.append("platform", platform);

        const result = await createDeal(formData);

        if (result?.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            setIsOpen(false);
            setIsSubmitting(false);
            setError(null);
            setStatus("lead");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 shadow-lg shadow-primary/10 active:scale-95 transition-all">
                    <Plus size={18} />
                    New Deal
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border border-border shadow-2xl bg-card/95 backdrop-blur-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-foreground tracking-tight">Add New Deal</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Fill in the details to add a new sponsorship to your pipeline.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand_name" className="text-foreground font-bold ml-1">Brand Name</Label>
                            <Input
                                required
                                id="brand_name"
                                name="brand_name"
                                placeholder="e.g. Nike"
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
                                placeholder="brand@example.com"
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
                                    placeholder="2500"
                                    className="rounded-xl border-border focus-visible:ring-indigo-500 bg-secondary/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-foreground font-bold ml-1">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
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
                            {isSubmitting ? "Creating..." : "Create Deal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
