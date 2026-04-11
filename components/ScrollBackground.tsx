"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  // Shift between #0A0A0A → #1A1408 (amber-warm) → #0A0A0A across scroll
  const bg = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    ["#0A0A0A", "#12100A", "#1A1408", "#12100A", "#0A0A0A"],
  );

  return (
    <motion.div ref={ref} style={{ backgroundColor: bg }}>
      {children}
    </motion.div>
  );
}
