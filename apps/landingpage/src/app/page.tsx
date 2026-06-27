import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Specialties from "@/components/Specialties";
import Features from "@/components/Features";
import ParallaxSection from "@/components/ParallaxSection";
import Infrastructure from "@/components/Infrastructure";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white selection:bg-violet-500/30 overflow-x-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="orb orb-1 absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-radial from-violet-600/15 to-transparent blur-[140px] pointer-events-none animate-[orb-float_22s_infinite_ease-in-out]" />
      <div className="orb orb-2 absolute top-[35%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-radial from-blue-600/12 to-transparent blur-[140px] pointer-events-none animate-[orb-float_22s_infinite_ease-in-out_6s]" />
      <div className="orb orb-3 absolute bottom-[-10%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-radial from-violet-600/15 to-transparent blur-[140px] pointer-events-none animate-[orb-float_22s_infinite_ease-in-out_12s]" />

      {/* Main Structural Layout */}
      <Header />
      <main>
        <Hero />
        <Stats />
        <Specialties />
        <Features />
        <ParallaxSection />
        <Infrastructure />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
