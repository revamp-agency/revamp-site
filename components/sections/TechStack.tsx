"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const techNames = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Vercel",
  "Supabase",
  "OpenAI",
  "Claude",
  "n8n",
  "Make",
  "Zapier",
  "Stripe",
  "WhatsApp",
  "Google",
  "Figma",
  "GitHub",
];

export default function TechStack() {
  const t = useTranslations("techStack");

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-20">
        <p className="text-center font-body font-bold text-[13px] uppercase tracking-[0.08em] text-amber mb-10">
          {t("overline")}
        </p>
      </div>

      {/* Infinite scroll */}
      <div className="group relative">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            },
          }}
          style={{ willChange: "transform" }}
        >
          {/* Double the array for seamless loop */}
          {[...techNames, ...techNames].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-body font-medium text-2xl text-text-tertiary select-none"
            >
              {name}
            </span>
          ))}
        </motion.div>

        {/* Pause on hover */}
        <style>{`
          .group:hover > div {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
}
