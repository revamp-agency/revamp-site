"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const items = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export default function FAQ() {
  const t = useTranslations("faq");

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
          className="text-center font-display font-black text-4xl md:text-section tracking-tighter text-text-primary mb-16"
        >
          {t("headline")}
        </motion.h2>
      </motion.div>

      <div className="mx-auto max-w-3xl px-6 md:px-20">
        <Accordion type="single" collapsible>
          {items.map((i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-b border-glass-border"
            >
              <AccordionTrigger className="py-6 text-left font-display font-bold text-xl text-text-primary hover:text-amber hover:no-underline [&>svg]:size-5 [&>svg]:text-text-tertiary">
                {t(`items.${i}.question`)}
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="font-body text-body-lg leading-relaxed text-text-secondary">
                  {t(`items.${i}.answer`)}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
