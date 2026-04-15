"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Globe,
  ShoppingCart,
  Code,
  Zap,
  Brain,
  CalendarCheck,
  MessageCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SERVICES = [
  { icon: Globe, color: "from-amber-900/40 to-amber-800/20", key: 0 },
  { icon: ShoppingCart, color: "from-orange-900/40 to-orange-800/20", key: 1 },
  { icon: Code, color: "from-yellow-900/40 to-yellow-800/20", key: 2 },
  { icon: Zap, color: "from-red-900/40 to-red-800/20", key: 3 },
  { icon: Brain, color: "from-violet-900/40 to-violet-800/20", key: 4 },
  { icon: CalendarCheck, color: "from-stone-700/40 to-stone-600/20", key: 5 },
  { icon: MessageCircle, color: "from-zinc-700/40 to-zinc-600/20", key: 6 },
  { icon: Search, color: "from-neutral-700/40 to-neutral-600/20", key: 7 },
];

const LONG_DESC =
  "Progettiamo soluzioni digitali su misura per la tua impresa. Ogni progetto parte da un'analisi approfondita delle tue esigenze, con l'obiettivo di creare strumenti che generano risultati concreti e misurabili nel tempo.";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const easeCurve: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const heroVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 40 : -40,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: easeCurve },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -40 : 40,
    transition: { duration: 0.3, ease: easeCurve },
  }),
};

/* ── Debug slider helper ── */
function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa" }}>
        <span>{label}</span>
        <span style={{ color: "#f5f5f5", fontFamily: "monospace" }}>
          {step < 1 ? value.toFixed(2) : value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#f59e0b", height: 14 }}
      />
    </div>
  );
}

export default function ServicesGrid() {
  const t = useTranslations("services");
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [portalReady, setPortalReady] = useState(false);
  useEffect(() => setPortalReady(true), []);

  /* ── Debug tuning state ── */
  const [showDebug, setShowDebug] = useState(true);
  const [fanSpread, setFanSpread] = useState(110);
  const [pivotX, setPivotX] = useState(-300);
  const [pivotY, setPivotY] = useState(300);
  const [cardWidth, setCardWidth] = useState(160);
  const [cardHeight, setCardHeight] = useState(240);
  const [containerHeight, setContainerHeight] = useState(500);
  const [hoverLift, setHoverLift] = useState(60);
  const [hoverScale, setHoverScale] = useState(1.08);
  const [fanOffsetX, setFanOffsetX] = useState(0);
  const [fanOffsetY, setFanOffsetY] = useState(0);
  const [fanRotation, setFanRotation] = useState(0);
  const [cardBorderOpacity, setCardBorderOpacity] = useState(0.55);
  const [cardBgColor, setCardBgColor] = useState("#0c0c0c");
  const [cardTextSize, setCardTextSize] = useState(15);
  const [iconSize, setIconSize] = useState(32);

  /* ── D key toggle ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        setShowDebug((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index === active) return;
      setDirection(index > active ? 1 : -1);
      setActive(index);
    },
    [active],
  );

  const ActiveIcon = SERVICES[active].icon;
  const stackCards = SERVICES.filter((_, i) => i !== active);

  /* ── Memoized card layout — does NOT depend on hoveredIdx ── */
  const cardLayouts = useMemo(() => {
    const n = stackCards.length;
    const half = fanSpread / 2;
    return stackCards.map((svc, i) => {
      const angle = n > 1 ? -half + (i / (n - 1)) * fanSpread : 0;
      return { serviceKey: svc.key, angle, zIndex: i + 1 };
    });
  }, [stackCards.length, active, fanSpread]); // eslint-disable-line react-hooks/exhaustive-deps

  const logValues = () => {
    console.log(JSON.stringify({
      fanSpread, pivotX, pivotY, cardWidth, cardHeight, containerHeight,
      hoverLift, hoverScale, fanOffsetX, fanOffsetY, fanRotation,
      cardBorderOpacity, cardBgColor, cardTextSize, iconSize,
    }, null, 2));
  };

  return (
    <>
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-20">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.p
            variants={fadeUp}
            className="font-body text-overline uppercase tracking-widest text-amber"
          >
            {t("overline")}
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display font-extrabold text-section tracking-tighter text-text-primary max-w-4xl"
          >
            {t("headline")}
          </motion.h2>
        </motion.div>

        {/* Two-column layout — desktop */}
        <div className="mt-16 hidden md:flex gap-12 items-center min-h-[520px]">
          {/* LEFT PANEL — hero */}
          <div className="w-[45%] flex-shrink-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={heroVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div
                  className={`bg-gradient-to-br ${SERVICES[active].color} rounded-2xl p-4 w-fit`}
                >
                  <ActiveIcon className="h-14 w-14 text-amber" strokeWidth={1.5} />
                </div>

                <h3 className="mt-8 font-display font-extrabold text-5xl md:text-6xl tracking-tighter text-text-primary leading-none">
                  {t(`cards.${active}.title`)}
                </h3>

                <p className="mt-4 font-body text-lg text-amber font-medium">
                  {t(`cards.${active}.short`)}
                </p>

                <p className="mt-6 font-body text-body text-text-secondary leading-relaxed max-w-md text-base">
                  {LONG_DESC}
                </p>

                <p className="mt-8 font-mono text-xs text-text-secondary tracking-widest uppercase">
                  {`0${active + 1} / 08`}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Arrows + dots */}
            <div className="mt-10 flex items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => goTo(Math.max(0, active - 1))}
                  className="rounded-full border border-glass-border bg-glass-fill p-2.5 text-text-secondary hover:text-text-primary hover:border-amber/40 transition-colors duration-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => goTo(Math.min(7, active + 1))}
                  className="rounded-full border border-glass-border bg-glass-fill p-2.5 text-text-secondary hover:text-text-primary hover:border-amber/40 transition-colors duration-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 ml-6">
                {SERVICES.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      i === active
                        ? "w-6 bg-amber"
                        : "w-2 bg-glass-border cursor-pointer"
                    }`}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — fan deck */}
          <div className="flex-1 pl-8" style={{ overflow: "visible" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: containerHeight,
                overflow: "visible",
                transform: `translate(${fanOffsetX}px, ${fanOffsetY}px) rotate(${fanRotation}deg)`,
              }}
            >
              {/* DISCOVER label */}
              <p
                className="absolute font-display font-bold text-[28px] text-amber/[0.06] uppercase tracking-[0.2em] select-none pointer-events-none"
                style={{ right: 0, top: "40%", transform: "translateY(-50%)", zIndex: 25 }}
              >
                DISCOVER
              </p>

              <AnimatePresence>
                {stackCards.map((svc, i) => {
                  const layout = cardLayouts[i];
                  if (!layout) return null;
                  const isHovered = hoveredIdx === svc.key;
                  const Icon = svc.icon;

                  return (
                    <motion.div
                      key={svc.key}
                      style={{
                        position: "absolute",
                        left: "30%",
                        bottom: "40px",
                        marginLeft: -(cardWidth / 2),
                        width: cardWidth,
                        height: cardHeight,
                        transformOrigin: `${pivotX}% ${pivotY}%`,
                        zIndex: isHovered ? 99 : layout.zIndex,
                      }}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, rotate: 0, y: 60 }
                      }
                      animate={{
                        opacity: 1,
                        rotate: layout.angle,
                        ...(prefersReducedMotion ? {} : { y: 0 }),
                      }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -40 }
                      }
                      transition={{
                        type: "tween",
                        duration: 0.35,
                        ease: "easeOut",
                      }}
                    >
                      {/* Inner — hover pull (along card's local axis) */}
                      <motion.div
                        animate={{
                          y: isHovered ? -hoverLift : 0,
                          scale: isHovered ? hoverScale : 1,
                        }}
                        transition={{
                          type: "tween",
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        onMouseEnter={() => setHoveredIdx(svc.key)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        onClick={() => goTo(svc.key)}
                        className="w-full h-full rounded-2xl overflow-hidden cursor-pointer"
                        style={{
                          background: cardBgColor,
                          border: `1px solid rgba(245, 158, 11, ${cardBorderOpacity})`,
                          boxShadow: isHovered
                            ? "0 0 30px rgba(245, 158, 11, 0.12), 0 8px 32px rgba(0,0,0,0.5)"
                            : "0 4px 20px rgba(0,0,0,0.4)",
                        }}
                      >
                        <div className="relative z-10 h-[60%] flex flex-col items-center justify-center px-3">
                          <Icon
                            className="text-amber"
                            strokeWidth={1.5}
                            style={{ width: iconSize, height: iconSize }}
                          />
                          <p
                            className="mt-4 font-display font-semibold text-text-primary leading-tight text-center"
                            style={{ fontSize: cardTextSize }}
                          >
                            {t(`cards.${svc.key}.title`)}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="mt-16 md:hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={heroVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div
                className={`bg-gradient-to-br ${SERVICES[active].color} rounded-2xl p-4 w-fit`}
              >
                <ActiveIcon className="h-14 w-14 text-amber" strokeWidth={1.5} />
              </div>

              <h3 className="mt-8 font-display font-extrabold text-4xl tracking-tighter text-text-primary leading-none">
                {t(`cards.${active}.title`)}
              </h3>

              <p className="mt-4 font-body text-lg text-amber font-medium">
                {t(`cards.${active}.short`)}
              </p>

              <p className="mt-6 font-body text-body text-text-secondary leading-relaxed text-base">
                {LONG_DESC}
              </p>

              <p className="mt-8 font-mono text-xs text-text-secondary tracking-widest uppercase">
                {`0${active + 1} / 08`}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {stackCards.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.key}
                  onClick={() => goTo(svc.key)}
                  className="rounded-2xl overflow-hidden p-4 h-[130px] flex flex-col items-center justify-center gap-3 text-center"
                  style={{
                    background: cardBgColor,
                    border: `1px solid rgba(245, 158, 11, ${cardBorderOpacity})`,
                  }}
                >
                  <Icon className="h-6 w-6 text-amber" strokeWidth={1.5} />
                  <p className="font-display font-semibold text-sm text-text-primary leading-tight">
                    {t(`cards.${svc.key}.title`)}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => goTo(Math.max(0, active - 1))}
                className="rounded-full border border-glass-border bg-glass-fill p-2.5 text-text-secondary hover:text-text-primary hover:border-amber/40 transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => goTo(Math.min(7, active + 1))}
                className="rounded-full border border-glass-border bg-glass-fill p-2.5 text-text-secondary hover:text-text-primary hover:border-amber/40 transition-colors duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 ml-6">
              {SERVICES.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i === active
                      ? "w-6 bg-amber"
                      : "w-2 bg-glass-border cursor-pointer"
                  }`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
      {/* ── Debug Control Panel — portaled to body ── */}
      {portalReady && showDebug && createPortal(
        <div
          data-debug-panel
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            width: 280,
            maxHeight: "calc(100vh - 32px)",
            overflowY: "auto",
            background: "rgba(10, 10, 10, 0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: 16,
            zIndex: 99999,
            fontFamily: "system-ui, sans-serif",
            fontSize: 12,
            color: "#f5f5f5",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.05em" }}>FAN DEBUG</span>
            <button
              onClick={() => setShowDebug(false)}
              style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 16 }}
            >
              X
            </button>
          </div>

          <Slider label="Fan Spread" value={fanSpread} onChange={setFanSpread} min={0} max={180} unit="deg" />
          <Slider label="Pivot X" value={pivotX} onChange={setPivotX} min={-500} max={200} unit="%" />
          <Slider label="Pivot Y" value={pivotY} onChange={setPivotY} min={-200} max={500} unit="%" />
          <Slider label="Fan Offset X" value={fanOffsetX} onChange={setFanOffsetX} min={-500} max={500} unit="px" />
          <Slider label="Fan Offset Y" value={fanOffsetY} onChange={setFanOffsetY} min={-500} max={500} unit="px" />
          <Slider label="Fan Rotation" value={fanRotation} onChange={setFanRotation} min={-90} max={90} unit="deg" />

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "8px 0" }} />

          <Slider label="Card Width" value={cardWidth} onChange={setCardWidth} min={80} max={300} unit="px" />
          <Slider label="Card Height" value={cardHeight} onChange={setCardHeight} min={120} max={400} unit="px" />
          <Slider label="Container Height" value={containerHeight} onChange={setContainerHeight} min={300} max={900} unit="px" />

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "8px 0" }} />

          <Slider label="Hover Lift" value={hoverLift} onChange={setHoverLift} min={0} max={150} unit="px" />
          <Slider label="Hover Scale" value={hoverScale} onChange={setHoverScale} min={1} max={1.3} step={0.01} unit="x" />

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "8px 0" }} />

          <Slider label="Icon Size" value={iconSize} onChange={setIconSize} min={16} max={64} unit="px" />
          <Slider label="Card Text Size" value={cardTextSize} onChange={setCardTextSize} min={8} max={24} unit="px" />
          <Slider label="Border Opacity" value={cardBorderOpacity} onChange={setCardBorderOpacity} min={0} max={1} step={0.05} />

          <div style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", marginBottom: 4 }}>
              <span>BG Color</span>
              <span style={{ color: "#f5f5f5", fontFamily: "monospace" }}>{cardBgColor}</span>
            </div>
            <input
              type="color"
              value={cardBgColor}
              onChange={(e) => setCardBgColor(e.target.value)}
              style={{ width: "100%", height: 24, border: "none", background: "transparent", cursor: "pointer" }}
            />
          </div>

          <button
            onClick={logValues}
            style={{
              width: "100%",
              marginTop: 8,
              padding: "8px 0",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              borderRadius: 8,
              color: "#f59e0b",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            Log Current Values
          </button>

          <p style={{ marginTop: 8, fontSize: 10, color: "#555", textAlign: "center" }}>
            Press D to toggle this panel
          </p>
        </div>,
        document.body,
      )}
    </>
  );
}
