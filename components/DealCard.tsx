'use client'

import { Deal } from "@/types";
import { BadgeDollarSign, Mail, User, FileText, CalendarDays } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditDealDialog from "./EditDealDialog";

interface DealCardProps {
    deal: Deal;
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

export default function DealCard({ deal }: DealCardProps) {
    const isInvoiced = deal.status === "paid";

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
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                                {new Date(deal.due_date).toLocaleDateString()}
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
