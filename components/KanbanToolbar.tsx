'use client'

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

export type SortOption = "newest" | "price_high" | "price_low" | "due_date";

interface KanbanToolbarProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    sortBy: SortOption;
    setSortBy: (value: SortOption) => void;
}

export default function KanbanToolbar({
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
}: KanbanToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 bg-card border border-border p-4 rounded-3xl shadow-sm">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                    placeholder="Search visible deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-2xl border-border focus-visible:ring-primary bg-secondary/50"
                />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-bold text-muted-foreground hidden sm:inline-block">Sort by:</span>
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                    <SelectTrigger className="w-full sm:w-[180px] rounded-2xl border-border focus:ring-primary bg-secondary/50">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={14} className="text-primary" />
                            <SelectValue placeholder="Sort by" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border shadow-xl bg-card">
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="due_date">Due Date (Urgent)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
