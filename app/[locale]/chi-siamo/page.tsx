"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function RevealParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"],
  });
  const color = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(85,85,85)", "rgb(245,245,245)"],
  );

  return (
    <motion.p
      ref={ref}
      style={{ color }}
      className="font-body text-body-lg md:text-[20px] leading-relaxed mb-10"
    >
      {text}
    </motion.p>
  );
}

export default function ChiSiamoPage() {
  const t = useTranslations("chiSiamoPage");

  const paragraphs = [0, 1, 2, 3, 4, 5] as const;

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-32">
        {/* Subtle amber glow */}
        <div
          className="pointer-events-none absolute h-[500px] w-[700px] rounded-full opacity-100 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-20 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="font-display font-black text-section tracking-tighter text-text-primary max-w-4xl mx-auto"
          >
            {t("headline")}
          </motion.h1>
        </motion.div>
      </section>

      {/* Manifesto body */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-20">
          {paragraphs.map((i) => (
            <RevealParagraph key={i} text={t(`paragraphs.${i}`)} />
          ))}

          {/* Closing line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 font-display font-bold text-sub text-amber"
          >
            {t("closing")}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 rounded-xl bg-amber px-8 py-4 font-body font-bold text-body text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
            >
              {t("cta")}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
