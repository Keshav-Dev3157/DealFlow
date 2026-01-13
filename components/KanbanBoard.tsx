'use client'

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useState, useMemo, useEffect } from "react";
import { Deal, DealStatus } from "@/types";
import KanbanColumn from "./KanbanColumn";
import DealCard from "./DealCard";
import { updateDealStatus } from "@/app/actions";
import { toast } from "sonner";
import KanbanToolbar, { SortOption } from "./KanbanToolbar";

interface KanbanBoardProps {
    deals: Deal[];
}

const columns: { id: DealStatus; title: string; color: string }[] = [
    { id: "lead", title: "Lead", color: "bg-blue-500" },
    { id: "working", title: "Working", color: "bg-amber-500" },
    { id: "paid", title: "Paid", color: "bg-emerald-500" },
];

export default function KanbanBoard({ deals: initialDeals }: KanbanBoardProps) {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);

    // Sync state with server data when it changes (e.g. after createDeal)
    useEffect(() => {
        setDeals(initialDeals);
    }, [initialDeals]);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [activeTab, setActiveTab] = useState<DealStatus>("lead");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null;

    // Filter and Sort Logic
    const filteredDeals = useMemo(() => {
        let result = [...deals];

        // 1. Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((deal) =>
                deal.brand_name.toLowerCase().includes(query)
            );
        }

        // 2. Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case "price_high":
                    return b.price - a.price;
                case "price_low":
                    return a.price - b.price;
                case "due_date":
                    if (!a.due_date) return 1;
                    if (!b.due_date) return -1;
                    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
                case "newest":
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

        return result;
    }, [deals, searchQuery, sortBy]);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    async function handleStatusChange(dealId: string, newStatus: DealStatus) {
        const deal = deals.find((d) => d.id === dealId);
        if (!deal || deal.status === newStatus) return;

        // Optimistic update
        setDeals((prev) =>
            prev.map((d) => (d.id === dealId ? { ...d, status: newStatus } : d))
        );

        // Server update
        const result = await updateDealStatus(dealId, newStatus);
        if (result?.error) {
            // Revert on error
            setDeals((prev) =>
                prev.map((d) => (d.id === dealId ? { ...d, status: deal.status } : d))
            );
            toast.error("Failed to update status");
        } else {
            toast.success("Status updated!");
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const dealId = active.id as string;
        const newStatus = over.id as DealStatus;

        handleStatusChange(dealId, newStatus);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <KanbanToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            {/* Mobile Tab Bar */}
            <div className="flex md:hidden bg-card border border-border rounded-2xl p-1.5 mb-6 shadow-sm sticky top-[80px] z-20">
                {columns.map((column) => (
                    <button
                        key={column.id}
                        onClick={() => setActiveTab(column.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${activeTab === column.id
                            ? `${column.color} text-white shadow-lg`
                            : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                    >
                        {column.title}
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === column.id ? "bg-white/20" : "bg-card border border-border"
                            }`}>
                            {filteredDeals.filter(d => d.status === column.id).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {columns.map((column) => (
                    <div key={column.id} className={activeTab === column.id ? "block" : "hidden md:block"}>
                        <KanbanColumn
                            title={column.title}
                            color={column.color}
                            statusId={column.id}
                            deals={filteredDeals.filter((d) => d.status === column.id)}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                ))}
            </div>

            <DragOverlay>
                {activeDeal ? (
                    <div className="rotate-3 scale-105">
                        <DealCard deal={activeDeal} onStatusChange={handleStatusChange} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
