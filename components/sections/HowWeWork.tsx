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

const steps = [0, 1, 2, 3] as const;
const numbers = ["01", "02", "03", "04"];

export default function HowWeWork() {
  const t = useTranslations("howWeWork");

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
          className="text-center font-body font-bold text-[13px] uppercase tracking-[0.08em] text-amber mb-4"
        >
          {t("overline")}
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="text-center font-display font-black text-4xl md:text-section tracking-tighter text-text-primary mb-16 md:mb-20"
        >
          {t("headline")}
        </motion.h2>

        {/* Timeline */}
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          {/* Connecting line — desktop only */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] hidden h-px bg-amber/20 md:block" />

          {steps.map((i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative text-center"
            >
              <span className="font-display font-black text-7xl text-amber leading-none">
                {numbers[i]}
              </span>
              <h3 className="mt-4 font-display font-bold text-2xl text-text-primary">
                {t(`steps.${i}.title`)}
              </h3>
              <p className="mt-2 mx-auto max-w-xs font-body text-body text-text-secondary">
                {t(`steps.${i}.text`)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
