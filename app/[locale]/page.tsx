import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6">
      <h1 className="font-display font-black text-text-primary text-[56px] md:text-[96px] leading-none tracking-[-0.03em]">
        Revamp
      </h1>
      <p className="font-body text-text-secondary text-[20px] max-w-[600px] text-center leading-relaxed">
        Costruiamo il futuro digitale delle imprese italiane.
      </p>
    </div>
  );
}
