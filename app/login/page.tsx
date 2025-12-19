'use client'

import { useState } from "react";
import { login, signup } from "@/app/auth-actions";
import { Zap, Loader2, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const result = (isLogin ? await login(formData) : await signup(formData)) as { error?: string, success?: string };

        if (result?.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else if (result?.success) {
            setMessage(result.success);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
            <Link href="/" className="mb-12 flex items-center gap-2 group transition-all">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap size={24} className="text-white" fill="currentColor" />
                </div>
                <span className="text-2xl font-black tracking-tighter italic text-white">DEALFLOW</span>
            </Link>

            <div className="w-full max-w-md">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isLogin ? "Welcome Back" : "Scale your pipeline"}
                        </h1>
                        <p className="text-zinc-400">
                            {isLogin ? "Enter your credentials to access your dashboard." : "Create an account to start managing your deals."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-sm font-medium">
                                {message}
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label htmlFor="full_name" className="text-sm font-semibold text-zinc-400 ml-1">
                                    Full Name
                                </label>
                                <input
                                    required
                                    id="full_name"
                                    name="full_name"
                                    placeholder="Alex Rivera"
                                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-semibold text-zinc-400 ml-1">
                                Email Address
                            </label>
                            <input
                                required
                                type="email"
                                id="email"
                                name="email"
                                placeholder="alex@example.com"
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="text-sm font-semibold text-zinc-400">
                                    Password
                                </label>
                                {isLogin && (
                                    <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <input
                                required
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4 border-none"
                        >
                            {isSubmitting ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>


                </div>

                <p className="mt-8 text-center text-zinc-500 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-white font-bold hover:underline underline-offset-4 transition-all ml-1"
                    >
                        {isLogin ? "Sign Up Free" : "Sign In"}
                    </button>
                </p>
            </div>
        </div>
    );
}
