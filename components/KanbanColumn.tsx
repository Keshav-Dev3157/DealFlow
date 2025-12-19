'use client'

import { useDroppable } from "@dnd-kit/core";
import { Deal, DealStatus } from "@/types";
import DraggableDealCard from "./DraggableDealCard";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, DollarSign } from "lucide-react";

interface KanbanColumnProps {
    title: string;
    color: string;
    statusId: DealStatus;
    deals: Deal[];
}

const columnIcons: Record<string, React.ReactNode> = {
    Lead: <Zap size={14} />,
    Working: <Clock size={14} />,
    Paid: <DollarSign size={14} />,
};

export default function KanbanColumn({ title, color, statusId, deals }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: statusId,
    });


    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        {columnIcons[title]}
                    </div>
                    <h2 className="font-black text-slate-700 uppercase tracking-tighter italic">
                        {title}
                    </h2>
                </div>
                <Badge variant="secondary" className="rounded-full font-black px-2.5">
                    {deals.length}
                </Badge>
            </div>

            <div
                ref={setNodeRef}
                className={`flex flex-col gap-4 min-h-[500px] p-3 rounded-[32px] border transition-all duration-200 ${isOver
                    ? "bg-indigo-50/50 border-indigo-300 scale-[1.01]"
                    : "bg-slate-100/40 border-slate-200/50"
                    }`}
            >
                {deals.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200/60 rounded-[24px] py-12 opacity-50">
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                            Drop Here
                        </p>
                    </div>
                ) : (
                    deals.map((deal) => (
                        <DraggableDealCard key={deal.id} deal={deal} />
                    ))
                )}
            </div>
        </div>
    );
}
