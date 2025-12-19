'use client'

import { Deal, DealStatus } from "@/types";
import { BadgeDollarSign, Mail, User, FileText, CalendarDays, ChevronRight, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditDealDialog from "./EditDealDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DealCardProps {
    deal: Deal;
    onStatusChange: (dealId: string, newStatus: DealStatus) => Promise<void>;
}

const statusVariants: Record<Deal["status"], "default" | "secondary" | "outline" | "destructive"> = {
    lead: "secondary",
    working: "outline",
    paid: "default",
};

const statusLabels: Record<Deal["status"], string> = {
    lead: "Lead",
    working: "Working",
    paid: "Paid",
};

export default function DealCard({ deal, onStatusChange }: DealCardProps) {
    const isInvoiced = deal.status === "paid";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCopyLink = () => {
        const url = `${window.location.origin}/invoices/${deal.id}`;
        navigator.clipboard.writeText(url);
        toast.success("Invoice link copied to clipboard!");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm group">
                <CardHeader className="p-5 pb-0">
                    <div className="flex justify-between items-start">
                        <Badge
                            variant={statusVariants[deal.status]}
                            className="font-bold uppercase tracking-wider text-[10px] px-2 py-0"
                        >
                            {statusLabels[deal.status]}
                        </Badge>
                        <div className="flex items-center gap-2">
                            {/* Mobile Move Button */}
                            <div className="md:hidden">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                            <ChevronRight size={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl">
                                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Move to Stage</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            disabled={deal.status === "lead"}
                                            onClick={() => onStatusChange(deal.id, "lead")}
                                            className="font-bold text-slate-700"
                                        >
                                            Lead
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            disabled={deal.status === "working"}
                                            onClick={() => onStatusChange(deal.id, "working")}
                                            className="font-bold text-slate-700"
                                        >
                                            Working
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            disabled={deal.status === "paid"}
                                            onClick={() => onStatusChange(deal.id, "paid")}
                                            className="font-bold text-slate-700"
                                        >
                                            Paid
                                        </DropdownMenuItem>
                                        <div className="h-px bg-slate-100 my-1" />
                                        <DropdownMenuItem
                                            onClick={handleCopyLink}
                                            className="font-bold text-indigo-600 focus:text-indigo-700"
                                        >
                                            <Copy size={14} className="mr-2" />
                                            Copy Link
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                    onClick={handleCopyLink}
                                    title="Copy Invoice Link"
                                >
                                    <Copy size={16} />
                                </Button>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                <EditDealDialog deal={deal} />
                            </div>
                            <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                                <User size={18} />
                            </div>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-3 truncate group-hover:text-indigo-600 transition-colors">
                        {deal.brand_name}
                    </h3>
                </CardHeader>

                <CardContent className="p-5 pt-2">
                    <div className="flex items-center text-slate-500 text-sm">
                        <Mail size={14} className="mr-2 opacity-70" />
                        <span className="truncate">{deal.contact_email}</span>
                    </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-slate-50/50 bg-slate-50/30">
                    <div className="flex flex-col">
                        <div className="flex items-center text-slate-900 font-bold">
                            <BadgeDollarSign size={16} className="mr-1 text-emerald-600" />
                            <span>${deal.price.toLocaleString()}</span>
                        </div>
                        {deal.due_date && (
                            <div className="flex items-center text-[10px] text-slate-400 mt-1 uppercase tracking-tight font-bold">
                                <CalendarDays size={10} className="mr-1" />
                                {mounted ? new Date(deal.due_date).toLocaleDateString() : "---"}
                            </div>
                        )}
                    </div>

                    {isInvoiced && (
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="h-8 gap-1.5 font-bold text-xs shadow-none border hover:bg-white hover:text-indigo-600 transition-all active:scale-95"
                        >
                            <Link href={`/invoices/${deal.id}`}>
                                <FileText size={14} />
                                Invoice
                            </Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
