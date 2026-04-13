"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLenis } from "@/components/SmoothScroll";

export default function RevampLogo() {
  const t = useTranslations("hero");
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const lenis = useLenis();

  const scrollY = useMotionValue(0);
  const [scrollRange, setScrollRange] = useState(400);

  useEffect(() => {
    const update = () => {
      setScrollRange(window.innerHeight * 0.5);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    const handler = ({ scroll }: { scroll: number }) => scrollY.set(scroll);
    lenis.on("scroll", handler);
    return () => {
      lenis.off("scroll", handler);
    };
  }, [lenis, scrollY]);

  const fontSize = useTransform(scrollY, [0, scrollRange], [110, 40]);
  const subtitleOpacity = useTransform(scrollY, [0, scrollRange * 0.3], [1, 0]);
  const subtitleMaxHeight = useTransform(
    scrollY,
    [0, scrollRange * 0.4],
    [40, 0]
  );
  const subtitleMarginTop = useTransform(scrollY, [0, scrollRange * 0.4], [8, 0]);

  // Static small version for secondary pages
  if (!isHomepage) {
    return (
      <div className="fixed top-8 left-8 z-40">
        <Link
          href="/"
          className="font-display font-black text-[22px] tracking-tighter text-text-primary leading-none"
        >
          REVAMP
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed top-8 left-8 z-40">
      <Link href="/" className="block">
        <motion.h1
          className="font-display font-black tracking-tighter text-text-primary leading-none"
          style={{ fontSize }}
        >
          REVAMP
        </motion.h1>
      </Link>
      <motion.p
        className="font-mono text-xs text-text-secondary max-w-[320px] overflow-hidden"
        style={{
          opacity: subtitleOpacity,
          maxHeight: subtitleMaxHeight,
          marginTop: subtitleMarginTop,
        }}
      >
        {t("subtitle")}
      </motion.p>
    </div>
  );
}
