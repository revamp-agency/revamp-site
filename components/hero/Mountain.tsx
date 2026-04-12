"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

export default function Mountain() {
  const { solidGeo, wfGeo } = useMemo(() => {
    const noise2D = createNoise2D();

    const WIDTH = 24;
    const DEPTH = 16;
    const SEG_X = 280;
    const SEG_Z = 180;

    const geo = new THREE.PlaneGeometry(WIDTH, DEPTH, SEG_X, SEG_Z);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const cols = SEG_X + 1;
    const rows = SEG_Z + 1;

    // Pass 1: displacement
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // 1. Distance from center with z weighting
      const d = Math.sqrt(x * x + z * z * 1.5);

      // 2. Center envelope (never used alone — combined with edge terrain via max)
      let centerEnvelope = Math.max(0, 1 - d / 10);
      centerEnvelope = Math.pow(centerEnvelope, 1.6);

      // 3. Multi-octave noise with high-frequency detail
      const h =
        noise2D(x * 0.18, z * 0.18) * 1.0 +
        noise2D(x * 0.40, z * 0.40) * 0.55 +
        noise2D(x * 0.85, z * 0.85) * 0.30 +
        noise2D(x * 1.8, z * 1.8) * 0.15 +
        noise2D(x * 3.5, z * 3.5) * 0.08;

      // 4. Central mountain mass
      const centerMountain = (h * 0.5 + 0.5) * centerEnvelope * 5.0;

      // 5. Edge terrain — hills across the entire plane, no flat areas
      const edgeHills =
        noise2D(x * 0.25, z * 0.25) * 0.8 +
        noise2D(x * 0.55, z * 0.55) * 0.35 +
        noise2D(x * 1.2, z * 1.2) * 0.15;
      const edgeTerrain = (edgeHills * 0.5 + 0.5) * 1.2;

      // 6. Combine: central mass dominates where tall, edge hills fill everywhere else
      let height = Math.max(centerMountain, edgeTerrain);

      // 7. Micro-texture everywhere
      height += noise2D(x * 4, z * 4) * 0.05;

      pos.setY(i, height);
    }

    // Pass 2: one smoothing pass — average with 4 neighbors
    const heights = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) heights[i] = pos.getY(i);

    for (let row = 1; row < rows - 1; row++) {
      for (let col = 1; col < cols - 1; col++) {
        const i = row * cols + col;
        const avg =
          (heights[i] +
            heights[(row - 1) * cols + col] +
            heights[(row + 1) * cols + col] +
            heights[row * cols + (col - 1)] +
            heights[row * cols + (col + 1)]) /
          5;
        pos.setY(i, avg);
      }
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();

    // Wireframe from same displaced geometry
    const wfGeo = new THREE.WireframeGeometry(geo);

    return { solidGeo: geo, wfGeo };
  }, []);

  return (
    <group position={[0, -0.5, 0]}>
      {/* Solid black occluder — hides back-face lines */}
      <mesh geometry={solidGeo} renderOrder={0}>
        <meshBasicMaterial
          color={0x000000}
          transparent={false}
          depthWrite={true}
          side={THREE.DoubleSide}
          polygonOffset={true}
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      {/* Wireframe on top, depth-tested against the solid */}
      <lineSegments geometry={wfGeo} renderOrder={1}>
        <lineBasicMaterial
          color={0xffffff}
          transparent
          opacity={0.65}
          depthTest={true}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
