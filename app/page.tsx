import Hero from "@/components/landing/Hero";
import FeatureSection from "@/components/landing/FeatureSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Hero />
      <FeatureSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
