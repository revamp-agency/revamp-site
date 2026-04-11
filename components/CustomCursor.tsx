"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 300, damping: 25, mass: 0.5 };
  const followerX = useSpring(cursorX, springConfig);
  const followerY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    const hasHover = window.matchMedia("(hover: hover)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isDesktop || !hasHover || reducedMotion) return;

    setVisible(true);
    document.documentElement.classList.add("custom-cursor-active");

    function onMove(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    }

    function onEnterInteractive() {
      setHovering(true);
    }
    function onLeaveInteractive() {
      setHovering(false);
    }

    document.addEventListener("mousemove", onMove);

    const observer = new MutationObserver(attachListeners);

    function attachListeners() {
      const interactives = document.querySelectorAll("a, button, [role='button'], input, textarea, select");
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
    }

    attachListeners();
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("custom-cursor-active");
      observer.disconnect();
      const interactives = document.querySelectorAll("a, button, [role='button'], input, textarea, select");
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
    };
  }, [cursorX, cursorY]);

  if (!visible) return null;

  return (
    <>
      {/* Dot — follows exactly */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-amber"
        style={{
          width: 8,
          height: 8,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hovering ? 0 : 1,
        }}
      />
      {/* Circle follower — springs behind */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-amber/40"
        style={{
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          x: followerX,
          y: followerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{ width: { duration: 0.2 }, height: { duration: 0.2 } }}
      />
    </>
  );
}
