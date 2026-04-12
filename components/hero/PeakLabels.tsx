"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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

const THRESHOLD = 0.7;
const PROXIMITY_RANGE = 2.5;

interface PeakLabelProps {
  peak: Peak;
  index: number;
  cursorLocalPosRef: React.RefObject<THREE.Vector3>;
}

function PeakLabel({ peak, index, cursorLocalPosRef }: PeakLabelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isClose, setIsClose] = useState(false);
  const prevIsCloseRef = useRef(false);

  useFrame(({ clock }) => {
    // Breathing offset — same formula as Mountain so label stays glued
    const t = clock.getElapsedTime();
    const s = peak.breathStrength;
    const breath =
      Math.sin(t * 0.6 + peak.basePosition.x * 0.4 + peak.basePosition.z * 0.3) *
      0.18 *
      s;
    const slowSwell = Math.sin(t * 0.25) * 0.06 * s;
    const currentY = peak.basePosition.y + breath + slowSwell;

    if (groupRef.current) {
      groupRef.current.position.set(
        peak.basePosition.x,
        currentY,
        peak.basePosition.z
      );
    }

    // Full 3D distance in group-local space
    if (cursorLocalPosRef.current) {
      const dx = peak.basePosition.x - cursorLocalPosRef.current.x;
      const dy = currentY - cursorLocalPosRef.current.y;
      const dz = peak.basePosition.z - cursorLocalPosRef.current.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const close = dist <= THRESHOLD;
      if (close !== prevIsCloseRef.current) {
        prevIsCloseRef.current = close;
        setIsClose(close);
      }

      if (!close && textRef.current) {
        textRef.current.textContent = dist.toFixed(2) + "m";
      }
    }
  });

  return (
    <group ref={groupRef}>
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

function ConnectionLines({
  peaks,
  cursorLocalPosRef,
}: {
  peaks: Peak[];
  cursorLocalPosRef: React.RefObject<THREE.Vector3>;
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(peaks.length * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, [peaks.length]);

  useFrame(({ clock }) => {
    if (!cursorLocalPosRef.current) return;
    const t = clock.getElapsedTime();
    const positions = geometry.attributes.position.array as Float32Array;
    let lineCount = 0;

    for (const peak of peaks) {
      const s = peak.breathStrength;
      const breath =
        Math.sin(t * 0.6 + peak.basePosition.x * 0.4 + peak.basePosition.z * 0.3) *
        0.18 *
        s;
      const slowSwell = Math.sin(t * 0.25) * 0.06 * s;
      const currentY = peak.basePosition.y + breath + slowSwell;

      const dx = peak.basePosition.x - cursorLocalPosRef.current.x;
      const dy = currentY - cursorLocalPosRef.current.y;
      const dz = peak.basePosition.z - cursorLocalPosRef.current.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < PROXIMITY_RANGE) {
        const base = lineCount * 6;
        positions[base] = cursorLocalPosRef.current.x;
        positions[base + 1] = cursorLocalPosRef.current.y;
        positions[base + 2] = cursorLocalPosRef.current.z;
        positions[base + 3] = peak.basePosition.x;
        positions[base + 4] = currentY;
        positions[base + 5] = peak.basePosition.z;
        lineCount++;
      }
    }

    geometry.setDrawRange(0, lineCount * 2);
    (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <lineSegments geometry={geometry} renderOrder={2}>
      <lineBasicMaterial color="#F59E0B" transparent opacity={0.25} />
    </lineSegments>
  );
}

interface PeakLabelsProps {
  peaks: Peak[];
  cursorLocalPosRef: React.RefObject<THREE.Vector3>;
}

export default function PeakLabels({ peaks, cursorLocalPosRef }: PeakLabelsProps) {
  if (peaks.length === 0) return null;

  return (
    <>
      {peaks.map((peak, i) => (
        <PeakLabel
          key={i}
          peak={peak}
          index={i}
          cursorLocalPosRef={cursorLocalPosRef}
        />
      ))}
      <ConnectionLines peaks={peaks} cursorLocalPosRef={cursorLocalPosRef} />
    </>
  );
}
