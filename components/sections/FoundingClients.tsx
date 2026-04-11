"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const SPOTS_TAKEN = 10;
const TOTAL_SPOTS = 10;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function FoundingClients() {
  const t = useTranslations("foundingClients");

  return (
    <section className="relative overflow-hidden bg-bg-secondary py-20 md:py-40">
      {/* Amber radial glow — center bottom */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-amber/8 blur-[120px]" />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.p
            variants={fadeUp}
            className="font-body text-overline uppercase tracking-widest text-amber"
          >
            {t("overline")}
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display font-black text-section tracking-tighter text-text-primary max-w-4xl"
          >
            {t("headline")}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 font-body text-body-lg text-text-secondary leading-relaxed max-w-2xl"
          >
            {t("body")}
          </motion.p>

          {/* Counter */}
          <motion.div variants={fadeUp} className="mt-12">
            <span className="font-display font-black text-[64px] md:text-[96px] leading-none tracking-tighter text-text-primary">
              {SPOTS_TAKEN}
            </span>
            <span className="ml-2 font-display font-bold text-2xl md:text-sub tracking-tight text-text-tertiary">
              / {TOTAL_SPOTS}
            </span>
            <p className="mt-2 font-body text-body-lg text-text-secondary">
              {t("counter")}
            </p>
          </motion.div>

          {/* Check items */}
          <motion.div variants={fadeUp} className="mt-12 flex flex-col gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-amber" strokeWidth={1.5} />
                <p className="font-body text-body-lg text-text-primary">
                  {t(`checks.${i}`)}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-12">
            <a
              href="#final-cta"
              className="inline-flex items-center gap-2 rounded-xl bg-amber px-8 py-4 font-body font-bold text-body text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
            >
              {t("cta")}
            </a>
          </motion.div>

          {/* Micro-note */}
          <motion.p variants={fadeUp} className="mt-4 font-body text-caption text-text-tertiary">
            {t("note")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
