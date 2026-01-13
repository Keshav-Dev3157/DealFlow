import Hero from "@/components/landing/Hero";
import StickyScrollReveal from "@/components/landing/StickyScrollReveal";
import Footer from "@/components/landing/Footer";


export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <StickyScrollReveal />
      <Footer />
    </main>
  );
}
