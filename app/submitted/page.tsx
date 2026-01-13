import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield } from "lucide-react";

export default async function SubmittedPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 selection:bg-primary/30">
            <div className="w-full max-w-md text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                </div>

                <h1 className="text-4xl font-black text-foreground tracking-tight mb-4 uppercase italic">
                    Application Received
                </h1>

                <div className="space-y-4 text-muted-foreground text-lg mb-10 leading-relaxed font-medium">
                    <p>
                        We have received your request to access the VibeFlow private network.
                    </p>
                    <p>
                        Our team will get in touch with you shortly to complete your onboarding.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 py-2 px-4 rounded-full mx-auto w-fit">
                        <Shield size={14} />
                        Identity Verified
                    </div>
                </div>

                <Link href="/">
                    <Button variant="outline" className="h-12 px-8 rounded-full border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all hover:scale-105 font-bold">
                        Return to Homepage
                    </Button>
                </Link>
            </div>
        </div>
    );
}
