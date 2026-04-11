"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/PASTE_YOUR_FORMSPREE_ID_HERE";

const cardIcons = [Mail, MessageCircle, Phone];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContattiPage() {
  const t = useTranslations("contattiPage");
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
      _subject: "Contatto generale da revamp.it",
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
        setErrorMsg(t("form.error"));
      }
    } catch {
      setState("error");
      setErrorMsg(t("form.error"));
    }
  }

  const inputClass =
    "rounded-xl border border-glass-border bg-glass-fill px-5 py-4 font-body text-body text-text-primary placeholder:text-text-tertiary transition-colors duration-200 focus:border-amber/50 focus:ring-1 focus:ring-amber/30 focus:outline-none";

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-32 text-center">
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

      {/* Contact cards */}
      <section className="pb-20 md:pb-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={container}
          className="mx-auto max-w-[1440px] px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[0, 1, 2].map((i) => {
            const Icon = cardIcons[i];
            return (
              <motion.a
                key={i}
                variants={fadeUp}
                href={t(`contactCards.${i}.href`)}
                target={i === 0 ? undefined : "_blank"}
                rel={i === 0 ? undefined : "noopener noreferrer"}
                className="group rounded-2xl p-8 bg-glass-fill backdrop-blur-md border border-glass-border transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(245,158,11,0.08)] block"
              >
                <Icon className="h-8 w-8 text-amber" strokeWidth={1.5} />
                <h3 className="mt-6 font-display font-bold text-xl text-text-primary">
                  {t(`contactCards.${i}.label`)}
                </h3>
                <p className="mt-2 font-body text-body text-text-secondary">
                  {t(`contactCards.${i}.value`)}
                </p>
              </motion.a>
            );
          })}
        </motion.div>
      </section>

      {/* Form */}
      <section className="pb-20 md:pb-32">
        <div className="mx-auto max-w-2xl px-6 md:px-20">
          {state === "success" ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center font-display font-bold text-2xl text-text-primary"
            >
              {t("form.success")}
            </motion.p>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              <input type="text" name="name" required placeholder={t("form.placeholders.name")} className={inputClass} />
              <input type="text" name="contact" required placeholder={t("form.placeholders.contact")} className={inputClass} />
              <textarea name="project" required rows={4} placeholder={t("form.placeholders.project")} className={`resize-none ${inputClass}`} />

              <button
                type="submit"
                disabled={state === "submitting"}
                className="mx-auto w-full md:w-auto rounded-full bg-amber px-8 py-4 font-body font-bold text-body text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] disabled:opacity-70 disabled:hover:scale-100"
              >
                {state === "submitting" ? t("form.submitting") : t("form.submit")}
              </button>

              {state === "error" && (
                <p className="text-center font-body text-caption text-red-400">{errorMsg}</p>
              )}
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}
