import PriceShock from "@/components/sections/PriceShock";
import ServicesGrid from "@/components/sections/ServicesGrid";
import CustomSoftware from "@/components/sections/CustomSoftware";
import HowWeWork from "@/components/sections/HowWeWork";
import WhyRevamp from "@/components/sections/WhyRevamp";
import TechStack from "@/components/sections/TechStack";
import FoundingClients from "@/components/sections/FoundingClients";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import ScrollBackground from "@/components/ScrollBackground";

import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <ScrollBackground>
      <Hero />
      <PriceShock />
      <ServicesGrid />
      <CustomSoftware />
      <HowWeWork />
      <WhyRevamp />
      <TechStack />
      <FoundingClients />
      <FAQ />
      <FinalCTA />
    </ScrollBackground>
  );
}
