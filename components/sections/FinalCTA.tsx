"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/PASTE_YOUR_FORMSPREE_ID_HERE";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

type FormState = "idle" | "submitting" | "success" | "error";

export default function FinalCTA() {
  const t = useTranslations("finalCta");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      contact: (form.elements.namedItem("contact") as HTMLInputElement).value,
      project: (form.elements.namedItem("project") as HTMLTextAreaElement).value,
      _subject: "Nuovo lead da revamp.it",
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setState("success");
      } else {
        setState("error");
        setErrorMsg(t("error"));
      }
    } catch {
      setState("error");
      setErrorMsg(t("error"));
    }
  }

  return (
    <section id="final-cta" className="py-20 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="font-display font-black text-section tracking-tighter text-text-primary"
          >
            {t("headline")}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 font-body text-body-lg text-text-secondary"
          >
            {t("subhead")}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          {state === "success" ? (
            <p className="text-center font-display font-bold text-2xl text-text-primary">
              {t("success")}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                required
                placeholder={t("placeholders.name")}
                className="rounded-xl border border-glass-border bg-glass-fill px-5 py-4 font-body text-body text-text-primary placeholder:text-text-tertiary transition-colors duration-200 focus:border-amber/50 focus:ring-1 focus:ring-amber/30 focus:outline-none"
              />
              <input
                type="text"
                name="contact"
                required
                placeholder={t("placeholders.contact")}
                className="rounded-xl border border-glass-border bg-glass-fill px-5 py-4 font-body text-body text-text-primary placeholder:text-text-tertiary transition-colors duration-200 focus:border-amber/50 focus:ring-1 focus:ring-amber/30 focus:outline-none"
              />
              <textarea
                name="project"
                required
                rows={4}
                placeholder={t("placeholders.project")}
                className="resize-none rounded-xl border border-glass-border bg-glass-fill px-5 py-4 font-body text-body text-text-primary placeholder:text-text-tertiary transition-colors duration-200 focus:border-amber/50 focus:ring-1 focus:ring-amber/30 focus:outline-none"
              />

              <button
                type="submit"
                disabled={state === "submitting"}
                className="mx-auto w-full md:w-auto rounded-full bg-amber px-8 py-4 font-body font-bold text-body text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] disabled:opacity-70 disabled:hover:scale-100"
              >
                {state === "submitting" ? t("submitting") : t("submit")}
              </button>

              {state === "error" && (
                <p className="text-center font-body text-caption text-red-400">
                  {errorMsg}
                </p>
              )}
            </form>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center font-body text-caption text-text-tertiary"
        >
          {t("note")}
        </motion.p>
      </div>
    </section>
  );
}
