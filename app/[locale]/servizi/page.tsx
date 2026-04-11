"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import {
  Globe,
  ShoppingCart,
  Code,
  Zap,
  Brain,
  CalendarCheck,
  MessageCircle,
  Search,
  CheckCircle2,
} from "lucide-react";

const icons = [Globe, ShoppingCart, Code, Zap, Brain, CalendarCheck, MessageCircle, Search];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function ServiziPage() {
  const t = useTranslations("serviziPage");

  return (
    <>
      {/* Page hero */}
      <section className="flex items-center justify-center pt-40 pb-20 md:pt-48 md:pb-32 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="mx-auto max-w-[1440px] px-6 md:px-20"
        >
          <motion.h1
            variants={fadeUp}
            className="font-display font-black text-section tracking-tighter text-text-primary"
          >
            {t("headline")}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl font-body text-body-lg text-text-secondary leading-relaxed"
          >
            {t("subhead")}
          </motion.p>
        </motion.div>
      </section>

      {/* Service sections */}
      {icons.map((Icon, i) => (
        <section
          key={i}
          className={`py-20 md:py-32 ${i % 2 === 1 ? "bg-bg-secondary" : ""}`}
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
            className={`mx-auto max-w-[1440px] px-6 md:px-20 flex flex-col ${
              i % 2 === 1 ? "md:items-end md:text-right" : ""
            }`}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <Icon className="h-10 w-10 text-amber" strokeWidth={1.5} />
              <h2 className="font-display font-black text-sub md:text-section tracking-tighter text-text-primary">
                {t(`services.${i}.title`)}
              </h2>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl font-body text-body-lg text-text-secondary leading-relaxed"
            >
              {t(`services.${i}.description`)}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <p className="font-body font-bold text-overline uppercase tracking-widest text-amber mb-4">
                {t("includes")}
              </p>
              <ul className="flex flex-col gap-3">
                {[0, 1, 2, 3, 4].map((j) => (
                  <li key={j} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-amber" strokeWidth={1.5} />
                    <span className="font-body text-body text-text-primary">
                      {t(`services.${i}.checks.${j}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10">
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 rounded-xl bg-amber px-8 py-4 font-body font-bold text-body text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
              >
                {t("cta")}
              </Link>
            </motion.div>
          </motion.div>
        </section>
      ))}
    </>
  );
}
