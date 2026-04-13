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
const CONNECTION_LINE_WIDTH = 2;
const CONNECTION_OPACITY = 0.25;

// ── Individual peak label ──

const _labelProjVec = new THREE.Vector3();

interface PeakLabelProps {
  peak: Peak;
  index: number;
  isActive: boolean;
  groupRef: React.RefObject<THREE.Group | null>;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
}

function PeakLabel({ peak, index, isActive, groupRef, mouseRef }: PeakLabelProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useFrame(({ camera, size }) => {
    if (!mouseRef.current || !groupRef.current) return;

    // Update distance text when not active
    if (!isActive && textRef.current) {
      const cursorPx = (mouseRef.current.x + 1) / 2 * size.width;
      const cursorPy = (mouseRef.current.y + 1) / 2 * size.height;

      _labelProjVec.set(peak.basePosition.x, peak.basePosition.y, peak.basePosition.z);
      groupRef.current.localToWorld(_labelProjVec);
      _labelProjVec.project(camera);
      const peakPx = (_labelProjVec.x + 1) / 2 * size.width;
      const peakPy = (1 - _labelProjVec.y) / 2 * size.height;

      const dist2dPx = Math.hypot(cursorPx - peakPx, cursorPy - peakPy);
      const dist2d = dist2dPx / size.width * 10;
      textRef.current.textContent = dist2d.toFixed(2) + "m";
    }
  });

  return (
    <group position={[peak.basePosition.x, peak.basePosition.y, peak.basePosition.z]}>
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
              {isActive ? (
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
}

function ConnectionLines({
  peaks,
  groupRef,
  mouseRef,
  cursorLocalPosRef,
}: ConnectionLinesProps) {
  const [lines, setLines] = useState<ActiveLine[]>([]);
  const prevKeysRef = useRef("");

  useFrame(({ camera, size }) => {
    if (!mouseRef.current || !groupRef.current || !cursorLocalPosRef.current) return;

    // Cursor pixel position (mouseRef is normalized -1 to +1)
    const cursorPx = (mouseRef.current.x + 1) / 2 * size.width;
    const cursorPy = (mouseRef.current.y + 1) / 2 * size.height;

    const newLines: ActiveLine[] = [];

    for (let i = 0; i < peaks.length; i++) {
      const peak = peaks[i];

      // Peak at rest position → world (apply group transform)
      _projVec.set(peak.basePosition.x, peak.basePosition.y, peak.basePosition.z);
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
          to: [peak.basePosition.x, peak.basePosition.y, peak.basePosition.z],
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

// ── Active peak tracker (single useFrame for all peaks) ──

const _activeProjVec = new THREE.Vector3();

function useActivePeak(
  peaks: Peak[],
  groupRef: React.RefObject<THREE.Group | null>,
  mouseRef: React.RefObject<{ x: number; y: number } | null>,
): number {
  const [activePeakIndex, setActivePeakIndex] = useState(-1);
  const activePeakRef = useRef(-1);

  useFrame(({ camera, size }) => {
    if (!mouseRef.current || !groupRef.current) {
      if (activePeakRef.current !== -1) {
        activePeakRef.current = -1;
        setActivePeakIndex(-1);
      }
      return;
    }

    const cursorPx = (mouseRef.current.x + 1) / 2 * size.width;
    const cursorPy = (mouseRef.current.y + 1) / 2 * size.height;

    let minDist = Infinity;
    let minIdx = -1;

    for (let i = 0; i < peaks.length; i++) {
      _activeProjVec.set(
        peaks[i].basePosition.x,
        peaks[i].basePosition.y,
        peaks[i].basePosition.z,
      );
      groupRef.current.localToWorld(_activeProjVec);
      _activeProjVec.project(camera);
      const peakPx = (_activeProjVec.x + 1) / 2 * size.width;
      const peakPy = (1 - _activeProjVec.y) / 2 * size.height;
      const dist2dPx = Math.hypot(cursorPx - peakPx, cursorPy - peakPy);
      const dist2d = dist2dPx / size.width * 10;

      if (dist2d < minDist) {
        minDist = dist2d;
        minIdx = i;
      }
    }

    const newActive = minDist <= SERVICE_THRESHOLD ? minIdx : -1;
    if (newActive !== activePeakRef.current) {
      activePeakRef.current = newActive;
      setActivePeakIndex(newActive);
    }
  });

  return activePeakIndex;
}

// ── Main export ──

interface PeakLabelsProps {
  peaks: Peak[];
  groupRef: React.RefObject<THREE.Group | null>;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  cursorLocalPosRef: React.RefObject<THREE.Vector3 | null>;
}

export default function PeakLabels({
  peaks,
  groupRef,
  mouseRef,
  cursorLocalPosRef,
}: PeakLabelsProps) {
  const activePeakIndex = useActivePeak(peaks, groupRef, mouseRef);

  if (peaks.length === 0) return null;

  return (
    <>
      {peaks.map((peak, i) => (
        <PeakLabel
          key={i}
          peak={peak}
          index={i}
          isActive={activePeakIndex === i}
          groupRef={groupRef}
          mouseRef={mouseRef}
        />
      ))}
      <ConnectionLines
        peaks={peaks}
        groupRef={groupRef}
        mouseRef={mouseRef}
        cursorLocalPosRef={cursorLocalPosRef}
      />
    </>
  );
}
