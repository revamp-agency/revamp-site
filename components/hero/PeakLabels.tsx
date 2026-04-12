"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
interface PeakData {
  localPos: THREE.Vector3;
  originalHeight: number;
}

const SERVICE_NAMES = [
  "Siti Web",
  "E-commerce",
  "Software su Misura",
  "Automazioni",
  "Integrazioni AI",
  "Prenotazioni",
  "Chatbot",
  "SEO",
];

const PROXIMITY_THRESHOLD = 0.6;

interface PeakLabelsProps {
  peaks: PeakData[];
  cursorWorldPosRef: React.RefObject<THREE.Vector3>;
}

// Mirror the shader breathing formula on CPU
function computeBreathOffset(
  originalHeight: number,
  posX: number,
  time: number
): number {
  // Must match shader: smoothstep(1.0, 6.0, originalHeight)
  const t = Math.max(0, Math.min(1, (originalHeight - 1.0) / 5.0));
  const breathStrength = t * t * (3 - 2 * t);
  const breath =
    Math.sin(time * 0.7 + originalHeight * 1.5 + posX * 0.4) *
    0.18 *
    breathStrength;
  const slowSwell = Math.sin(time * 0.3) * 0.05 * breathStrength;
  return breath + slowSwell;
}

function PeakLabel({
  peak,
  cursorWorldPosRef,
  serviceName,
}: {
  peak: PeakData;
  cursorWorldPosRef: React.RefObject<THREE.Vector3>;
  serviceName: string;
}) {
  const [isClose, setIsClose] = useState(false);
  const [distance, setDistance] = useState(0);

  // Persistent objects — never allocate in useFrame
  const anchorRef = useRef(new THREE.Object3D());
  const _flatPeak = useRef(new THREE.Vector3());
  const _flatCursor = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Compute breathing offset matching shader exactly
    const bobOffset = computeBreathOffset(
      peak.originalHeight,
      peak.localPos.x,
      t
    );

    // Update anchor position (this is in group-local space, inherits rotation)
    anchorRef.current.position.set(
      peak.localPos.x,
      peak.localPos.y + bobOffset,
      peak.localPos.z
    );

    // XZ-only distance to cursor
    _flatPeak.current.set(peak.localPos.x, 0, peak.localPos.z);
    _flatCursor.current.set(
      cursorWorldPosRef.current.x,
      0,
      cursorWorldPosRef.current.z
    );
    const d = _flatPeak.current.distanceTo(_flatCursor.current);

    const roundedD = Math.round(d * 100) / 100;
    if (roundedD !== distance) setDistance(roundedD);
    const close = d < PROXIMITY_THRESHOLD;
    if (close !== isClose) setIsClose(close);
  });

  return (
    <primitive object={anchorRef.current}>
      <Html center distanceFactor={8} zIndexRange={[10, 0]}>
        <div className="flex flex-col items-center gap-1 pointer-events-none select-none">
          <div
            className="w-2 h-2 rounded-full bg-amber"
            style={{ boxShadow: "0 0 12px rgba(245,158,11,0.6)" }}
          />
          <div className="min-w-[80px] text-center">
            <AnimatePresence mode="wait">
              {isClose ? (
                <motion.span
                  key="name"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-xs text-amber uppercase font-bold whitespace-nowrap"
                >
                  {serviceName}
                </motion.span>
              ) : (
                <motion.span
                  key="distance"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-xs text-text-secondary whitespace-nowrap"
                >
                  {distance.toFixed(2)}m
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Html>
    </primitive>
  );
}

export default function PeakLabels({
  peaks,
  cursorWorldPosRef,
}: PeakLabelsProps) {
  if (peaks.length === 0) return null;

  return (
    <>
      {peaks.map((peak, i) => (
        <PeakLabel
          key={i}
          peak={peak}
          cursorWorldPosRef={cursorWorldPosRef}
          serviceName={SERVICE_NAMES[i] ?? `Service ${i}`}
        />
      ))}
    </>
  );
}
