"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const LETTERS = ["R", "E", "V", "A", "M", "P"];

export default function WordmarkREVAMP() {
  const t = useTranslations("common");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="absolute bottom-12 left-0 right-0 z-30 flex flex-col items-center select-none">
      {/* Per-letter REVAMP */}
      <div
        className="font-display font-black tracking-tighter leading-[0.85] flex justify-center"
        style={{ fontSize: "clamp(80px, 11vw, 180px)" }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="inline-block cursor-default"
            style={{
              color: hoveredIndex === i ? "#F59E0B" : "#F5F5F5",
              transition:
                hoveredIndex === i
                  ? "color 600ms ease"
                  : "color 800ms ease",
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Subtitle */}
      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-text-secondary text-center px-6">
        {t("tagline")}
      </p>
    </div>
  );
}
