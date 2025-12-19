import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import SendInvoiceDialog from "@/components/SendInvoiceDialog";
import { Deal, Profile } from "@/types";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface InvoicePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
    const { id } = await params;

    // Validate UUID format to prevent database errors and ensure robustness
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        return notFound();
    }

    const supabase = await createClient();

    // Fetch deal
    const { data: deal, error: dealError } = await supabase
        .from("deals")
        .select("*")
        .eq("id", id)
        .single();

    if (dealError || !deal) {
        return notFound();
    }

    // Fetch profile (for "Pay To" info)
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", deal.user_id)
        .single();

    const typedDeal = deal as Deal;
    const typedProfile = profile as Profile;

    const invoiceDate = typedDeal.created_at
        ? new Date(typedDeal.created_at).toLocaleDateString()
        : new Date().toLocaleDateString();

    return (
        <div className="min-h-screen bg-slate-100 py-10 print:py-0 print:bg-white print:min-h-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <SendInvoiceDialog deal={typedDeal} />
                        <PrintButton />
                    </div>
                </div>

                {/* Paper Container */}
                <AnimatedSection y={40} duration={0.6}>
                    <div className="bg-white shadow-2xl rounded-sm p-8 md:p-16 min-h-0 md:min-h-[1100px] print:shadow-none print:p-8 print:min-h-0 relative overflow-hidden border print:border-slate-200">
                        {/* Decorative Top Border */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-600 print:bg-slate-900 print:h-1"></div>

                        {/* Top Section: Header & Date */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 md:mb-20 mt-4">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-none mb-2">
                                    INVOICE
                                </h1>
                                <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-widest pl-1">
                                    Professional Services
                                </p>
                            </div>
                            <div className="text-left md:text-right w-full md:w-auto">
                                <div className="inline-block md:block bg-slate-50 p-4 rounded-xl border border-slate-100 w-full md:w-auto">
                                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">Invoice Number</p>
                                    <p className="text-xl font-mono font-bold text-slate-900">#DF-{typedDeal.id.slice(0, 8).toUpperCase()}</p>

                                    <div className="h-px bg-slate-200 my-3"></div>

                                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">Date Issued</p>
                                    <p className="text-base font-bold text-slate-900">{invoiceDate}</p>

                                    {typedDeal.due_date && (
                                        <>
                                            <div className="h-px bg-slate-200 my-3"></div>
                                            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Due Date</p>
                                            <p className="text-base font-bold text-rose-600">
                                                {new Date(typedDeal.due_date).toLocaleDateString()}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: From & To */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-12 md:mb-20">
                            <div className="space-y-4 md:space-y-6">
                                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest border-b border-slate-200 pb-2">From</h3>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">
                                        {typedProfile?.full_name || "Influencer Name"}
                                    </h2>
                                    <p className="text-sm md:text-base text-slate-500 font-medium">Content Creator & Partner</p>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-6">
                                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest border-b border-slate-200 pb-2">Bill To</h3>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">
                                        {typedDeal.brand_name}
                                    </h2>
                                    <p className="text-sm md:text-base text-slate-500 font-medium">{typedDeal.contact_email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-12 md:mb-20">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[500px] md:min-w-0">
                                    <thead>
                                        <tr>
                                            <th className="py-4 text-xs uppercase font-bold text-slate-400 tracking-widest border-b-2 border-slate-100">Description</th>
                                            <th className="py-4 text-right text-xs uppercase font-bold text-slate-400 tracking-widest border-b-2 border-slate-100">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-6 md:py-8 border-b border-slate-50">
                                                <p className="font-bold text-slate-900 text-lg md:text-xl mb-2">Content Creation & Sponsorship</p>
                                                <p className="text-slate-500 text-sm md:text-base">Agreed fees for deliverables regarding {typedDeal.brand_name} campaign.</p>
                                            </td>
                                            <td className="py-6 md:py-8 text-right font-bold text-slate-900 text-lg md:text-xl border-b border-slate-50 align-top">
                                                ${typedDeal.price.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer: Payment & Total */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start pb-24 md:pb-32">
                            {/* Payment Details */}
                            <div className="bg-indigo-50/50 p-6 md:p-8 rounded-2xl border border-indigo-100 print:bg-white print:border-slate-300 order-2 md:order-1">
                                <h4 className="text-xs uppercase font-bold text-indigo-900 tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    Payment Methods
                                </h4>
                                {typedProfile?.payment_details ? (
                                    <p className="text-slate-700 text-sm whitespace-pre-line leading-7 font-medium">
                                        {typedProfile.payment_details}
                                    </p>
                                ) : (
                                    <p className="text-slate-400 italic text-sm">No payment details added.</p>
                                )}
                            </div>

                            {/* Total Calculation */}
                            <div className="text-left md:text-right space-y-4 order-1 md:order-2">
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="font-medium">Subtotal</span>
                                    <span>${typedDeal.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="font-medium">Tax (0%)</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="h-px bg-slate-900 my-4"></div>
                                <div className="flex justify-between items-center text-slate-900">
                                    <span className="font-serif font-bold text-lg md:text-xl">Total Due</span>
                                    <span className="font-serif font-bold text-3xl md:text-4xl ml-4">${typedDeal.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Terms */}
                        <div className="absolute bottom-8 md:bottom-16 left-8 md:left-16 right-8 md:right-16 border-t border-slate-100 pt-8 text-center">
                            <p className="text-slate-400 text-xs md:text-sm font-medium">
                                Thank you for your partnership. Please proceed with payment within 30 days.
                            </p>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Support Note */}
                <p className="mt-8 text-center text-slate-400 text-sm print:hidden">
                    Powered by DealFlow
                </p>
            </div>
        </div>
    );
}
