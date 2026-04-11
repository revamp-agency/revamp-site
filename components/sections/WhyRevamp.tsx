"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Code2, Cpu, BadgeCheck } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const icons = [Code2, Cpu, BadgeCheck];
const columns = [0, 1, 2] as const;

export default function WhyRevamp() {
  const t = useTranslations("whyRevamp");

  return (
    <section className="py-20 md:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-7xl px-6 md:px-20"
      >
        <motion.p
          variants={fadeUp}
          className="font-body font-bold text-[13px] uppercase tracking-[0.08em] text-amber mb-4"
        >
          {t("overline")}
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="font-display font-black text-4xl md:text-section tracking-tighter text-text-primary mb-16 max-w-3xl"
        >
          {t("headline")}
        </motion.h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {columns.map((i) => {
            const Icon = icons[i];
            return (
              <motion.div key={i} variants={fadeUp}>
                <Icon size={48} className="text-amber mb-6" />
                <h3 className="font-display font-bold text-3xl text-text-primary mb-3">
                  {t(`columns.${i}.title`)}
                </h3>
                <p className="font-body text-body-lg leading-relaxed text-text-secondary">
                  {t(`columns.${i}.text`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
