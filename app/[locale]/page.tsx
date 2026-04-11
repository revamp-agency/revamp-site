import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6">
      <h1 className="font-display font-black text-text-primary text-6xl md:text-9xl tracking-tighter">
        Revamp
      </h1>
      <p className="font-body text-text-secondary text-xl max-w-[600px] text-center">
        Costruiamo il futuro digitale delle imprese italiane.
      </p>
      <a
        href="#"
        className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-amber px-8 font-body font-bold text-bg-primary text-button tracking-wide transition-transform hover:scale-[1.02]"
      >
        {t("cta")}
      </a>
    </div>
  );
}
