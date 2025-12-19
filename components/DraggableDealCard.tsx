'use client'

import { useDraggable } from "@dnd-kit/core";
import { Deal } from "@/types";
import DealCard from "./DealCard";
import { GripVertical } from "lucide-react";

interface DraggableDealCardProps {
    deal: Deal;
}

export default function DraggableDealCard({ deal }: DraggableDealCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: deal.id,
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group ${isDragging ? "opacity-50 z-50" : ""}`}
        >
            {/* Drag Handle */}
            <div
                {...listeners}
                {...attributes}
                className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
            >
                <div className="p-1.5 rounded-lg bg-slate-200/80 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-all">
                    <GripVertical size={14} />
                </div>
            </div>

            <DealCard deal={deal} />
        </div>
    );
}
