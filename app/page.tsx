'use client';

import CTASection from "@/components/common/cta";
import Header from "@/components/common/header";
import HeroSection from "@/components/common/hero-section";
import HowItWorksSection from "@/components/common/how-it-work";
import BgGradient from "@/components/ui/bgGradient";


export default function Home() {

 
  return (
    <div className="relative w-full">
      <BgGradient/>
      <div className="flex flex-col">
        <Header/>
        <HeroSection/>
        <HowItWorksSection/>
        <CTASection/>

      </div>
    </div>
  );
}
