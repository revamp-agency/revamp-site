"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import type { Peak } from "./Mountain";
import { smoothstep } from "./Mountain";

function candidateLetter(i: number): string {
  if (i < 26) return String.fromCharCode(65 + i);
  const first = String.fromCharCode(65 + Math.floor(i / 26) - 1);
  const second = String.fromCharCode(65 + (i % 26));
  return first + second;
}

function breathingY(
  peak: Peak,
  t: number,
  breathingSpeed: number,
  breathingAmplitude: number,
  breathingThreshold: number
): number {
  const s = smoothstep(breathingThreshold, breathingThreshold + 3.5, peak.originalHeight);
  const breath =
    Math.sin(t * breathingSpeed + peak.basePosition.x * 0.4 + peak.basePosition.z * 0.3) *
    breathingAmplitude *
    s;
  const slowSwell = Math.sin(t * 0.25) * 0.06 * s;
  return peak.basePosition.y + breath + slowSwell;
}

// ── Individual candidate label ──

interface CandidateLabelProps {
  peak: Peak;
  letter: string;
  breathingSpeed: number;
  breathingAmplitude: number;
  breathingThreshold: number;
}

function CandidateLabel({
  peak,
  letter,
  breathingSpeed,
  breathingAmplitude,
  breathingThreshold,
}: CandidateLabelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const currentY = breathingY(
      peak,
      clock.getElapsedTime(),
      breathingSpeed,
      breathingAmplitude,
      breathingThreshold
    );
    if (groupRef.current) {
      groupRef.current.position.set(peak.basePosition.x, currentY, peak.basePosition.z);
    }
  });

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center" style={{ transform: "translateY(-50%)" }}>
          <div className="mb-1">
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-[#0A0A0A] font-mono text-xs font-bold uppercase">
              {letter}
            </span>
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

interface CandidateConnectionLinesProps {
  peaks: Peak[];
  groupRef: React.RefObject<THREE.Group | null>;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  cursorLocalPosRef: React.RefObject<THREE.Vector3 | null>;
  connectionRange: number;
  connectionLineWidth: number;
  connectionOpacity: number;
  breathingSpeed: number;
  breathingAmplitude: number;
  breathingThreshold: number;
}

const _projVec = new THREE.Vector3();

function CandidateConnectionLines({
  peaks,
  groupRef,
  mouseRef,
  cursorLocalPosRef,
  connectionRange,
  connectionLineWidth,
  connectionOpacity,
  breathingSpeed,
  breathingAmplitude,
  breathingThreshold,
}: CandidateConnectionLinesProps) {
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
      const currentY = breathingY(peak, t, breathingSpeed, breathingAmplitude, breathingThreshold);

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

      if (dist2d < connectionRange) {
        const fadedOpacity = connectionOpacity * (1 - dist2d / connectionRange);
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
      // Update positions without key change
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
          lineWidth={connectionLineWidth}
          transparent
          opacity={line.opacity}
        />
      ))}
    </>
  );
}

// ── Main export ──

interface PeakCandidatesProps {
  peaks: Peak[];
  groupRef: React.RefObject<THREE.Group | null>;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  cursorLocalPosRef: React.RefObject<THREE.Vector3 | null>;
  connectionRange: number;
  connectionLineWidth: number;
  connectionOpacity: number;
  breathingSpeed: number;
  breathingAmplitude: number;
  breathingThreshold: number;
}

export default function PeakCandidates({
  peaks,
  groupRef,
  mouseRef,
  cursorLocalPosRef,
  connectionRange,
  connectionLineWidth,
  connectionOpacity,
  breathingSpeed,
  breathingAmplitude,
  breathingThreshold,
}: PeakCandidatesProps) {
  if (peaks.length === 0) return null;

  return (
    <>
      {peaks.map((peak, i) => (
        <CandidateLabel
          key={i}
          peak={peak}
          letter={candidateLetter(i)}
          breathingSpeed={breathingSpeed}
          breathingAmplitude={breathingAmplitude}
          breathingThreshold={breathingThreshold}
        />
      ))}
      <CandidateConnectionLines
        peaks={peaks}
        groupRef={groupRef}
        mouseRef={mouseRef}
        cursorLocalPosRef={cursorLocalPosRef}
        connectionRange={connectionRange}
        connectionLineWidth={connectionLineWidth}
        connectionOpacity={connectionOpacity}
        breathingSpeed={breathingSpeed}
        breathingAmplitude={breathingAmplitude}
        breathingThreshold={breathingThreshold}
      />
    </>
  );
}
