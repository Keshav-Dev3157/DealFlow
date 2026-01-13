'use client'

import { useState, useEffect } from "react";
import { Deliverable } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Link as LinkIcon, Loader2, Trash2 } from "lucide-react";
import { toggleDeliverable, addDeliverable, deleteDeliverable, updateDeliverableProof } from "@/app/actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface DeliverablesListProps {
    dealId: string;
}

export default function DeliverablesList({ dealId }: DeliverablesListProps) {
    const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newLabel, setNewLabel] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchDeliverables();
    }, [dealId]);

    async function fetchDeliverables() {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("deliverables")
            .select("*")
            .eq("deal_id", dealId)
            .order("created_at", { ascending: true });

        if (!error && data) {
            setDeliverables(data as Deliverable[]);
        }
        setIsLoading(false);
    }

    async function handleToggle(id: string, completed: boolean) {
        // Optimistic
        setDeliverables(prev => prev.map(d => d.id === id ? { ...d, completed } : d));
        const result = await toggleDeliverable(id, completed);
        if (result?.error) toast.error("Update failed");
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation(); // Prevent submitting parent form if any
        if (!newLabel.trim()) return;

        setIsAdding(true);
        try {
            const result = await addDeliverable(dealId, newLabel);
            if (result?.success) {
                setNewLabel("");
                fetchDeliverables();
                toast.success("Deliverable added");
            } else {
                toast.error(result?.error || "Failed to add");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsAdding(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Remove this deliverable?")) return;
        setDeliverables(prev => prev.filter(d => d.id !== id));
        const result = await deleteDeliverable(id);
        if (result?.error) toast.error("Delete failed");
    }

    async function handleUpdateProof(id: string, proof: string) {
        const result = await updateDeliverableProof(id, proof);
        if (result?.success) {
            toast.success("Proof updated");
            fetchDeliverables();
        } else {
            toast.error("Failed to update proof");
        }
    }

    if (isLoading && deliverables.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="animate-spin text-primary/40" size={24} />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loading Checklist...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pt-4 border-t border-border mt-4">
            <div className="flex items-center justify-between px-1">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Execution Checklist
                </h4>
                {isLoading && <Loader2 className="animate-spin text-muted-foreground" size={10} />}
            </div>

            <div className="space-y-3">
                {deliverables.map((item) => (
                    <div key={item.id} className="group flex flex-col gap-2 p-3 rounded-2xl bg-secondary/30 border border-transparent hover:border-border transition-all">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={item.completed}
                                onCheckedChange={(checked) => handleToggle(item.id, checked as boolean)}
                                className="h-5 w-5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <span className={`text-sm font-bold flex-1 ${item.completed ? 'text-muted-foreground line-through decoration-primary/50' : 'text-foreground'}`}>
                                {item.label}
                            </span>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 ml-8">
                            <div className="relative flex-1">
                                <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                <Input
                                    placeholder="Proof (URL or Note)"
                                    defaultValue={item.proof_url || ""}
                                    onBlur={(e) => {
                                        if (e.target.value !== item.proof_url) handleUpdateProof(item.id, e.target.value);
                                    }}
                                    className="h-8 pl-8 text-[10px] font-mono bg-background/50 border-none focus-visible:ring-primary/30 rounded-lg placeholder:text-muted-foreground/30"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAdd} className="flex items-center gap-2 px-1">
                <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="New deliverable..."
                    className="h-10 text-xs font-bold rounded-xl bg-background border-border focus-visible:ring-primary/20"
                    disabled={isAdding}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-95"
                    disabled={isAdding || !newLabel.trim()}
                >
                    {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
                </Button>
            </form>
        </div>
    );
}
