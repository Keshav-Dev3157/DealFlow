'use client';

import { useState } from 'react';
import { submitApplication } from '@/app/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, ShieldCheck, ChevronLeft, Check, TrendingUp, Users, Lock, Instagram, Youtube, Globe } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from "@/components/ui/checkbox";

type FormDataState = {
    full_name: string;
    email: string;
    password: string;
    // Socials
    instagram: string;
    tiktok: string;
    youtube: string;
    website: string;

    brand_deals_count: string;
    biggest_deal_size: string;
    is_agency_represented: boolean;
};

export default function ApplyPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormDataState>({
        full_name: '',
        email: '',
        password: '',
        instagram: '',
        tiktok: '',
        youtube: '',
        website: '',
        brand_deals_count: '',
        biggest_deal_size: '',
        is_agency_represented: false,
    });

    const updateField = (field: keyof FormDataState, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    async function handleSubmit() {
        setIsLoading(true);
        setError(null);

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'is_agency_represented') {
                if (value) form.append(key, 'on');
            } else {
                form.append(key, value as string);
            }
        });

        // We don't try/catch here because Server Actions that redirect 
        // throw a special NEXT_REDIRECT error that shouldn't be caught by a generic catch.
        const result = await submitApplication(form);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    }

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const isStep1Valid = formData.brand_deals_count && formData.biggest_deal_size;
    // Valid if at least one social is provided
    const isStep2Valid = formData.instagram.length > 1 || formData.tiktok.length > 1 || formData.youtube.length > 1 || formData.website.length > 1;
    const isStep3Valid = formData.full_name && formData.email && formData.password.length >= 6;

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 selection:bg-primary/30">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mx-auto">
                            <ShieldCheck className="text-primary-foreground" size={20} />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase italic">
                        Application Protocol
                    </h1>
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-[32px] p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                        <TrendingUp size={20} className="text-primary" />
                                        Deal History
                                    </h3>
                                    <p className="text-muted-foreground text-sm font-medium">To ensure quality, verify your operational volume.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-foreground/70 mb-3 block font-bold ml-1">How many brand deals have you closed?</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['0-5', '5-20', '20-50', '50+'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateField('brand_deals_count', opt)}
                                                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${formData.brand_deals_count === opt
                                                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                                                        : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                                                        }`}
                                                >
                                                    {opt} Deals
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-foreground/70 mb-3 block font-bold ml-1">Largest single deal size?</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['<1k', '1k-5k', '5k-10k', '10k+'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateField('biggest_deal_size', opt)}
                                                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${formData.biggest_deal_size === opt
                                                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                                                        : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                                                        }`}
                                                >
                                                    {opt === '<1k' ? 'Under $1k' : opt === '10k+' ? '$10k+' : `$${opt.replace('k', ',000')}`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={nextStep}
                                    disabled={!isStep1Valid}
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/10"
                                >
                                    Continue <ArrowRight className="ml-2" size={18} />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                        <Users size={20} className="text-primary" />
                                        Public Presence
                                    </h3>
                                    <p className="text-muted-foreground text-sm font-medium">Where is your audience most active?</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Instagram */}
                                    <div className="space-y-2">
                                        <Label className="text-foreground/70 flex items-center gap-2 font-bold ml-1"><Instagram size={14} /> Instagram</Label>
                                        <Input
                                            value={formData.instagram}
                                            onChange={(e) => updateField('instagram', e.target.value)}
                                            placeholder="@username"
                                            className="bg-secondary/50 border-border focus:border-primary text-foreground h-11 rounded-xl"
                                        />
                                    </div>

                                    {/* TikTok */}
                                    <div className="space-y-2">
                                        <Label className="text-foreground/70 flex items-center gap-2 font-bold ml-1">TikTok</Label>
                                        <Input
                                            value={formData.tiktok}
                                            onChange={(e) => updateField('tiktok', e.target.value)}
                                            placeholder="@username"
                                            className="bg-secondary/50 border-border focus:border-primary text-foreground h-11 rounded-xl"
                                        />
                                    </div>
                                    {/* YouTube */}
                                    <div className="space-y-2">
                                        <Label className="text-foreground/70 flex items-center gap-2 font-bold ml-1"><Youtube size={14} /> YouTube</Label>
                                        <Input
                                            value={formData.youtube}
                                            onChange={(e) => updateField('youtube', e.target.value)}
                                            placeholder="Channel URL"
                                            className="bg-secondary/50 border-border focus:border-primary text-foreground h-11 rounded-xl"
                                        />
                                    </div>

                                    {/* Website */}
                                    <div className="space-y-2">
                                        <Label className="text-foreground/70 flex items-center gap-2 font-bold ml-1"><Globe size={14} /> Website / Portfolio</Label>
                                        <Input
                                            value={formData.website}
                                            onChange={(e) => updateField('website', e.target.value)}
                                            placeholder="https://"
                                            className="bg-secondary/50 border-border focus:border-primary text-foreground h-11 rounded-xl"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3 bg-secondary/30 p-4 rounded-2xl border border-border">
                                        <Checkbox
                                            id="agency"
                                            checked={formData.is_agency_represented}
                                            onCheckedChange={(checked) => updateField('is_agency_represented', checked === true)}
                                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <label
                                            htmlFor="agency"
                                            className="text-sm font-bold leading-none text-muted-foreground cursor-pointer"
                                        >
                                            I am currently represented by an agency
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="ghost" onClick={prevStep} className="h-12 w-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary">
                                        <ChevronLeft size={24} />
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!isStep2Valid}
                                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/10"
                                    >
                                        Continue <ArrowRight className="ml-2" size={18} />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                        <Lock size={20} className="text-primary" />
                                        Secure Identity
                                    </h3>
                                    <p className="text-muted-foreground text-sm font-medium">Create your operator credentials.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-foreground/70 font-bold ml-1">Full Name</Label>
                                        <Input
                                            value={formData.full_name}
                                            onChange={(e) => updateField('full_name', e.target.value)}
                                            placeholder="Your legal name"
                                            className="bg-secondary/50 border-border focus:border-primary text-foreground h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-foreground/70 font-bold ml-1">Email Address</Label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="you@domain.com"
                                            className="bg-secondary/50 border-border focus:border-primary text-foreground h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-foreground/70 font-bold ml-1">Password</Label>
                                        <Input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            placeholder="Min. 6 characters"
                                            className="bg-secondary/50 border-border focus:border-primary text-foreground h-12 rounded-xl"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button variant="ghost" onClick={prevStep} className="h-12 w-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary">
                                        <ChevronLeft size={24} />
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading || !isStep3Valid}
                                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/10"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Encrypting...
                                            </>
                                        ) : (
                                            <>
                                                Submit Application <Check className="ml-2" size={18} />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
