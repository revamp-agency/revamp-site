"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import alea from "alea";

const SEED = "c";
const prng = alea(SEED);
const noise2D = createNoise2D(prng);

// Camera
const CAM_X = 0.1;
const CAM_Y = 2.2;
const CAM_Z = 6.3;
const LOOK_AT_X = 0.5;
const LOOK_AT_Y = 1.5;
const LOOK_AT_Z = -1.0;
const FOV = 59;

// Terrain
const HEIGHT_MULTIPLIER = 5.1;
const PEAK_SHARPNESS = 0.90;
const FOREGROUND_FLATTEN = 0.65;
const FOREGROUND_START = 0.63;
const RUGGEDNESS = 1.15;

// Wireframe
const LINE_OPACITY = 1.00;
const PEAK_BRIGHTNESS_BOOST = 1.00;

export default function Mountain() {
  useFrame(({ camera }) => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(CAM_X, CAM_Y, CAM_Z);
    if (cam.fov !== FOV) {
      cam.fov = FOV;
      cam.updateProjectionMatrix();
    }
    cam.lookAt(LOOK_AT_X, LOOK_AT_Y, LOOK_AT_Z);
  });

  const { solidGeo, wfGeo } = useMemo(() => {
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

      // 2. Center envelope
      let centerEnvelope = Math.max(0, 1 - d / 10);
      centerEnvelope = Math.pow(centerEnvelope, 1.6);

      // 3. Multi-octave noise — high-freq octaves scaled by ruggedness
      const h =
        noise2D(x * 0.18, z * 0.18) * 1.0 +
        noise2D(x * 0.40, z * 0.40) * 0.65 +
        noise2D(x * 0.85, z * 0.85) * 0.40 * RUGGEDNESS +
        noise2D(x * 1.8, z * 1.8) * 0.22 * RUGGEDNESS +
        noise2D(x * 3.5, z * 3.5) * 0.13 * RUGGEDNESS +
        noise2D(x * 6.5, z * 6.5) * 0.06 * RUGGEDNESS;

      // 4. Central mountain mass with peak sharpening
      const rawCenter = (h * 0.5 + 0.5) * centerEnvelope * 5.0;
      const centerMountain =
        Math.pow(rawCenter / 5.0, PEAK_SHARPNESS) * HEIGHT_MULTIPLIER;

      // 5. Edge terrain
      const edgeHills =
        noise2D(x * 0.25, z * 0.25) * 1.1 +
        noise2D(x * 0.55, z * 0.55) * 0.55 +
        noise2D(x * 1.2, z * 1.2) * 0.25;
      const edgeTerrain = (edgeHills * 0.5 + 0.5) * 2.2;

      // 6. Combine
      let height = Math.max(centerMountain, edgeTerrain);

      // 7. Micro-texture
      height += noise2D(x * 4, z * 4) * 0.05;

      // Foreground attenuation
      const foregroundFactor = (z + DEPTH / 2) / DEPTH;
      if (foregroundFactor > FOREGROUND_START) {
        const squash =
          1 - (foregroundFactor - FOREGROUND_START) / (1 - FOREGROUND_START);
        const squashCurve = Math.pow(squash, 0.6);
        height *= squashCurve * FOREGROUND_FLATTEN + 0.05;
      }

      // Safety clamp
      if (!isFinite(height)) height = 0;
      height = Math.max(0, Math.min(height, 12));

      pos.setY(i, height);
    }

    // Pass 2: smoothing
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
    geo.computeBoundingSphere();

    // Wireframe
    const wfGeo = new THREE.WireframeGeometry(geo);

    // Vertex colors
    const wfPos = wfGeo.attributes.position;
    const colors = new Float32Array(wfPos.count * 3);
    for (let i = 0; i < wfPos.count; i++) {
      const heightNorm = Math.min(
        Math.max(wfPos.getY(i) / HEIGHT_MULTIPLIER, 0),
        1
      );
      const brightness = 0.55 + heightNorm * PEAK_BRIGHTNESS_BOOST;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
    }
    wfGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

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
          polygonOffsetFactor={4}
          polygonOffsetUnits={4}
        />
      </mesh>
      {/* Wireframe on top, depth-tested against the solid */}
      <lineSegments geometry={wfGeo} renderOrder={1}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={LINE_OPACITY}
          depthTest={true}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
