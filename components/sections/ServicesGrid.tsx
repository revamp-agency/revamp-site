"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Globe,
  ShoppingCart,
  Code,
  Zap,
  Brain,
  CalendarCheck,
  MessageCircle,
  Search,
} from "lucide-react";

const icons = [Globe, ShoppingCart, Code, Zap, Brain, CalendarCheck, MessageCircle, Search];
const highlightedIndices = new Set([2, 3, 4]); // Software su Misura, Automazioni, Integrazioni AI

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function ServicesGrid() {
  const t = useTranslations("services");

  return (
    <section className="py-20 md:py-40">
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
            className="mt-4 font-display font-extrabold text-section tracking-tighter text-text-primary max-w-4xl"
          >
            {t("headline")}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {icons.map((Icon, i) => {
            const highlighted = highlightedIndices.has(i);
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`
                  group rounded-2xl p-8
                  bg-glass-fill backdrop-blur-md
                  border transition-all duration-300
                  ${highlighted
                    ? "border-amber/30 ring-1 ring-amber/20"
                    : "border-glass-border"
                  }
                  hover:border-white/20 hover:scale-[1.02]
                  hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]
                `}
              >
                <Icon className="h-8 w-8 text-amber" strokeWidth={1.5} />
                <h3 className="mt-6 font-display font-bold text-2xl text-text-primary">
                  {t(`cards.${i}.title`)}
                </h3>
                <p className="mt-3 font-body text-body text-text-secondary leading-relaxed">
                  {t(`cards.${i}.short`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
