import PriceShock from "@/components/sections/PriceShock";
import ServicesGrid from "@/components/sections/ServicesGrid";
import CustomSoftware from "@/components/sections/CustomSoftware";
import HowWeWork from "@/components/sections/HowWeWork";
import WhyRevamp from "@/components/sections/WhyRevamp";
import TechStack from "@/components/sections/TechStack";
import FoundingClients from "@/components/sections/FoundingClients";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      {/* Temporary hero placeholder */}
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 pt-24 pb-24">
        <h1 className="font-display font-black text-text-primary text-[56px] md:text-[96px] leading-none tracking-[-0.03em]">
          Revamp
        </h1>
        <p className="font-body text-text-secondary text-[20px] max-w-[600px] text-center leading-relaxed">
          Costruiamo il futuro digitale delle imprese italiane.
        </p>
      </div>

      <PriceShock />
      <ServicesGrid />
      <CustomSoftware />
      <HowWeWork />
      <WhyRevamp />
      <TechStack />
      <FoundingClients />
      <FAQ />
      <FinalCTA />
    </>
  );
}
