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
      <div className="fixed top-8 left-8 z-50">
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          {/* Backdrop renders first = paints behind Link */}
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "-12px",
              right: "-12px",
              bottom: "-8px",
              borderRadius: "12px",
              background: "rgba(10, 10, 10, 0.75)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          {/* Link renders second = paints on top */}
          <Link
            href="/"
            className="font-display font-black text-[22px] tracking-tighter text-text-primary leading-none"
            style={{ position: "relative" }}
          >
            REVAMP
          </Link>
        </div>
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
        className="font-mono text-text-secondary overflow-hidden"
        style={{
          opacity: subtitleOpacity,
          maxHeight: subtitleMaxHeight,
          marginTop: subtitleMarginTop,
          fontSize: "21px",
          width: "100%",
        }}
      >
        {t("subtitle")}
      </motion.p>
    </div>
  );
}
