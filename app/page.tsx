import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
