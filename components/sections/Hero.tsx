"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const clipReveal = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

function useCursorCapable() {
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    const hasHover = window.matchMedia("(hover: hover)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasCores = (navigator.hardwareConcurrency ?? 4) >= 4;
    setCapable(isDesktop && hasHover && !reducedMotion && hasCores);
  }, []);
  return capable;
}

function CursorReactiveHeadline({
  line1,
  line2,
}: {
  line1: string;
  line2: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const active = useCursorCapable();

  const onMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  const onLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [active, onMove, onLeave]);

  const springConfig = { stiffness: 120, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [2, -2]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-2, 2]), springConfig);

  return (
    <motion.h1
      ref={ref}
      style={active ? { rotateX, rotateY, transformPerspective: 800, willChange: "transform" } : undefined}
      className="font-display font-black text-hero tracking-tighter text-text-primary leading-[0.95] cursor-default text-center"
    >
      <motion.span variants={clipReveal} className="block">
        {line1}
      </motion.span>
      <motion.span variants={clipReveal} className="block">
        {line2}
      </motion.span>
    </motion.h1>
  );
}

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary">
      {/* Layer 1 — Drifting amber radial glow */}
      <motion.div
        className="pointer-events-none absolute z-10 h-[600px] w-[800px]"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
          filter: "blur(48px)",
          willChange: "transform",
        }}
        animate={{
          x: [-60, 60, -60],
          y: [-40, 40, -40],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 2 — Ghost "REVAMP" watermark text */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center select-none"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
        aria-hidden="true"
      >
        <span
          className="font-display font-black tracking-tighter leading-none text-white/[0.04]"
          style={{ fontSize: "clamp(200px, 25vw, 400px)" }}
        >
          REVAMP
        </span>
      </motion.div>

      {/* Layer 3 — Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-30 mx-auto max-w-[1440px] px-6 md:px-20 text-center"
      >
        {/* Overline */}
        <motion.p
          variants={fadeUp}
          className="font-body text-overline uppercase tracking-widest text-text-secondary"
        >
          {t("overline")}
        </motion.p>

        {/* Headline */}
        <div className="mt-6">
          <CursorReactiveHeadline
            line1={t("headline.line1")}
            line2={t("headline.line2")}
          />
        </div>

        {/* Subhead */}
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-8 max-w-2xl font-body text-body-lg leading-relaxed text-text-secondary"
        >
          {t("subhead")}
        </motion.p>

        {/* CTA row */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#final-cta"
            className="inline-flex items-center rounded-xl bg-amber px-8 py-4 font-body font-bold text-body text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href="#services"
            className="inline-flex items-center rounded-xl border border-glass-border bg-transparent px-8 py-4 font-body font-bold text-body text-text-primary transition-all duration-200 hover:bg-white/5"
          >
            {t("ctaSecondary")}
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.p
          variants={fadeUp}
          className="mt-10 font-body text-caption text-text-tertiary"
        >
          {t("trustStrip")}
        </motion.p>
      </motion.div>
    </section>
  );
}
