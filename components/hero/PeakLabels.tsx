"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import type { Peak } from "./Mountain";

const SERVICES = [
  "Siti Web",
  "E-commerce",
  "Software su Misura",
  "Automazioni",
  "Integrazioni AI",
  "Prenotazioni",
  "Chatbot",
  "SEO",
];

// 2D screen-space thresholds (normalized 0–10 scale)
const SERVICE_THRESHOLD = 0.7;
const CONNECTION_RANGE = 2.5;
const CONNECTION_LINE_WIDTH = 3.5;
const CONNECTION_OPACITY = 0.25;

function breathingY(peak: Peak, t: number, breathingSpeed: number): number {
  const s = peak.breathStrength;
  const breath =
    Math.sin(t * breathingSpeed + peak.basePosition.x * 0.4 + peak.basePosition.z * 0.3) *
    0.18 *
    s;
  const slowSwell = Math.sin(t * 0.25) * 0.06 * s;
  return peak.basePosition.y + breath + slowSwell;
}

// ── Individual peak label ──

const _labelProjVec = new THREE.Vector3();

interface PeakLabelProps {
  peak: Peak;
  index: number;
  groupRef: React.RefObject<THREE.Group | null>;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  breathingSpeed: number;
}

function PeakLabel({ peak, index, groupRef, mouseRef, breathingSpeed }: PeakLabelProps) {
  const labelGroupRef = useRef<THREE.Group>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isClose, setIsClose] = useState(false);
  const prevIsCloseRef = useRef(false);

  useFrame(({ camera, size, clock }) => {
    const t = clock.getElapsedTime();
    const currentY = breathingY(peak, t, breathingSpeed);

    if (labelGroupRef.current) {
      labelGroupRef.current.position.set(
        peak.basePosition.x,
        currentY,
        peak.basePosition.z
      );
    }

    if (!mouseRef.current || !groupRef.current) return;

    // Cursor pixel position (mouseRef is normalized -1 to +1)
    const cursorPx = (mouseRef.current.x + 1) / 2 * size.width;
    const cursorPy = (mouseRef.current.y + 1) / 2 * size.height;

    // Peak local → world → screen
    _labelProjVec.set(peak.basePosition.x, currentY, peak.basePosition.z);
    groupRef.current.localToWorld(_labelProjVec);
    _labelProjVec.project(camera);
    const peakPx = (_labelProjVec.x + 1) / 2 * size.width;
    const peakPy = (1 - _labelProjVec.y) / 2 * size.height;

    // 2D screen distance in normalized 0–10 scale
    const dist2dPx = Math.hypot(cursorPx - peakPx, cursorPy - peakPy);
    const dist2d = dist2dPx / size.width * 10;

    const close = dist2d <= SERVICE_THRESHOLD;
    if (close !== prevIsCloseRef.current) {
      prevIsCloseRef.current = close;
      setIsClose(close);
    }

    if (!close && textRef.current) {
      textRef.current.textContent = dist2d.toFixed(2) + "m";
    }
  });

  return (
    <group ref={labelGroupRef}>
      <Html
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div
          className="flex flex-col items-center"
          style={{ transform: "translateY(-50%)" }}
        >
          <div className="mb-1">
            <AnimatePresence mode="wait">
              {isClose ? (
                <motion.div
                  key="service"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="px-2 py-0.5 rounded-full bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/10 font-mono text-xs uppercase tracking-wider text-amber-500 font-bold whitespace-nowrap">
                    {SERVICES[index]}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="distance"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span
                    ref={textRef}
                    className="px-2 py-0.5 rounded-full bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/10 font-mono text-xs text-[#8A8A8A] whitespace-nowrap"
                  >
                    0.00m
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className="w-2 h-2 rounded-full bg-amber-500"
            style={{ boxShadow: "0 0 12px rgba(245,158,11,0.6)" }}
          />
        </div>
      </Html>
    </group>
  );
}

// ── Connection lines (2D screen-space distance) ──

interface ActiveLine {
  peakIdx: number;
  from: [number, number, number];
  to: [number, number, number];
  opacity: number;
}

const _projVec = new THREE.Vector3();

interface ConnectionLinesProps {
  peaks: Peak[];
  groupRef: React.RefObject<THREE.Group | null>;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  cursorLocalPosRef: React.RefObject<THREE.Vector3 | null>;
  breathingSpeed: number;
}

function ConnectionLines({
  peaks,
  groupRef,
  mouseRef,
  cursorLocalPosRef,
  breathingSpeed,
}: ConnectionLinesProps) {
  const [lines, setLines] = useState<ActiveLine[]>([]);
  const prevKeysRef = useRef("");

  useFrame(({ camera, size, clock }) => {
    if (!mouseRef.current || !groupRef.current || !cursorLocalPosRef.current) return;

    const t = clock.getElapsedTime();

    // Cursor pixel position (mouseRef is normalized -1 to +1)
    const cursorPx = (mouseRef.current.x + 1) / 2 * size.width;
    const cursorPy = (mouseRef.current.y + 1) / 2 * size.height;

    const newLines: ActiveLine[] = [];

    for (let i = 0; i < peaks.length; i++) {
      const peak = peaks[i];
      const currentY = breathingY(peak, t, breathingSpeed);

      // Peak local → world (apply group transform)
      _projVec.set(peak.basePosition.x, currentY, peak.basePosition.z);
      groupRef.current.localToWorld(_projVec);

      // Project peak to screen pixels
      _projVec.project(camera);
      const peakPx = (_projVec.x + 1) / 2 * size.width;
      const peakPy = (1 - _projVec.y) / 2 * size.height;

      // 2D screen distance in normalized 0–10 scale
      const dist2dPx = Math.hypot(cursorPx - peakPx, cursorPy - peakPy);
      const dist2d = dist2dPx / size.width * 10;

      if (dist2d < CONNECTION_RANGE) {
        const fadedOpacity = CONNECTION_OPACITY * (1 - dist2d / CONNECTION_RANGE);
        newLines.push({
          peakIdx: i,
          from: [
            cursorLocalPosRef.current.x,
            cursorLocalPosRef.current.y,
            cursorLocalPosRef.current.z,
          ],
          to: [peak.basePosition.x, currentY, peak.basePosition.z],
          opacity: fadedOpacity,
        });
      }
    }

    // Only trigger re-render when the set of visible lines changes
    const newKeys = newLines.map((l) => l.peakIdx).join(",");
    if (newKeys !== prevKeysRef.current) {
      prevKeysRef.current = newKeys;
      setLines(newLines);
    } else if (newLines.length > 0) {
      setLines(newLines);
    }
  });

  return (
    <>
      {lines.map((line) => (
        <Line
          key={line.peakIdx}
          points={[line.from, line.to]}
          color="#F59E0B"
          lineWidth={CONNECTION_LINE_WIDTH}
          transparent
          opacity={line.opacity}
        />
      ))}
    </>
  );
}

// ── Main export ──

interface PeakLabelsProps {
  peaks: Peak[];
  groupRef: React.RefObject<THREE.Group | null>;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  cursorLocalPosRef: React.RefObject<THREE.Vector3 | null>;
  breathingSpeed: number;
}

export default function PeakLabels({
  peaks,
  groupRef,
  mouseRef,
  cursorLocalPosRef,
  breathingSpeed,
}: PeakLabelsProps) {
  if (peaks.length === 0) return null;

  return (
    <>
      {peaks.map((peak, i) => (
        <PeakLabel
          key={i}
          peak={peak}
          index={i}
          groupRef={groupRef}
          mouseRef={mouseRef}
          breathingSpeed={breathingSpeed}
        />
      ))}
      <ConnectionLines
        peaks={peaks}
        groupRef={groupRef}
        mouseRef={mouseRef}
        cursorLocalPosRef={cursorLocalPosRef}
        breathingSpeed={breathingSpeed}
      />
    </>
  );
}
