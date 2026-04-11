"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function CustomSoftware() {
  const t = useTranslations("customSoftware");

  return (
    <section className="bg-bg-secondary py-20 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-20">
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
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`${i > 0 ? "md:border-l md:border-glass-border md:pl-8" : ""}`}
            >
              <p className="font-body text-overline uppercase tracking-widest text-amber">
                {t(`blocks.${i}.label`)}
              </p>
              <p className="mt-3 font-display font-bold text-2xl text-text-primary">
                {t(`blocks.${i}.text`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="mt-16"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-amber px-8 py-4 font-body font-bold text-body text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          >
            {t("cta")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
