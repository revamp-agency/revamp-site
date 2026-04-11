"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function PriceShock() {
  const t = useTranslations("priceShock");

  return (
    <section className="py-20 md:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-7xl px-6 md:px-20 text-center"
      >
        {/* €200 with amber glow */}
        <motion.div variants={fadeUp} className="relative inline-block">
          <div className="absolute inset-0 mx-auto h-64 w-96 rounded-3xl bg-amber-glow opacity-10 blur-3xl" />
          <span className="relative font-display font-black text-[120px] md:text-[200px] leading-none tracking-tighter text-text-primary">
            €200
          </span>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="mt-6 font-display font-bold text-2xl md:text-sub tracking-tight text-text-primary"
        >
          {t("subheadline")}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-6 mx-auto max-w-2xl font-body text-body-lg leading-relaxed text-text-secondary"
        >
          {t("body")}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-4 font-body text-caption text-text-tertiary"
        >
          {t("note")}
        </motion.p>
      </motion.div>
    </section>
  );
}
