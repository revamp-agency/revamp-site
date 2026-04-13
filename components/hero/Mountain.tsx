"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import alea from "alea";
import { useControls, folder } from "leva";
import PeakLabels from "./PeakLabels";

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

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export interface Peak {
  index: number;
  basePosition: THREE.Vector3;
  originalHeight: number;
  breathStrength: number;
}

// Cursor raycasting — camera-perpendicular plane through the lookAt point
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();
const _camDir = new THREE.Vector3(
  LOOK_AT_X - CAM_X, LOOK_AT_Y - CAM_Y, LOOK_AT_Z - CAM_Z
).normalize();
const _cursorPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
  new THREE.Vector3().copy(_camDir).negate(),
  new THREE.Vector3(LOOK_AT_X, LOOK_AT_Y, LOOK_AT_Z)
);
const _intersection = new THREE.Vector3();
const _invMatrix = new THREE.Matrix4();

interface MountainProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

export default function Mountain({ mouseRef }: MountainProps) {
  const { breathingSpeed } = useControls({
    Breathing: folder({
      breathingSpeed: { value: 0.25, min: 0.05, max: 1.0, step: 0.05 },
    }),
  });

  const groupRef = useRef<THREE.Group>(null);
  const basePositionsRef = useRef<Float32Array | null>(null);
  const breathStrengthRef = useRef<Float32Array | null>(null);
  const baseWfPositionsRef = useRef<Float32Array | null>(null);
  const wfBreathStrengthRef = useRef<Float32Array | null>(null);
  const solidGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const wfGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const cursorLocalPosRef = useRef(new THREE.Vector3());

  const { solidGeo, wfGeo, peaks } = useMemo(() => {
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

    // Store base positions and breath strengths for solid geometry
    const basePos = new Float32Array(pos.array as Float32Array);
    const bStrength = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      bStrength[i] = smoothstep(0.8, 4.5, basePos[i * 3 + 1]);
    }
    basePositionsRef.current = basePos;
    breathStrengthRef.current = bStrength;
    solidGeoRef.current = geo;

    // Peak detection — all local maxima in front 2/3 of the plane
    const FRONT_CUTOFF_Z = -2.67; // back 1/3 cutoff: -8 + 16/3 ≈ -2.67
    const SPREAD_MIN = 0.7;

    const localMaxima: { index: number; x: number; y: number; z: number }[] = [];
    for (let row = 1; row < rows - 1; row++) {
      for (let col = 1; col < cols - 1; col++) {
        const idx = row * cols + col;
        const ht = pos.getY(idx);
        const z = pos.getZ(idx);
        if (
          z > FRONT_CUTOFF_Z &&
          ht > pos.getY((row - 1) * cols + col) &&
          ht > pos.getY((row + 1) * cols + col) &&
          ht > pos.getY(row * cols + (col - 1)) &&
          ht > pos.getY(row * cols + (col + 1))
        ) {
          localMaxima.push({ index: idx, x: pos.getX(idx), y: ht, z });
        }
      }
    }
    localMaxima.sort((a, b) => b.y - a.y);

    // Visibility filter — raycast from camera to each candidate through the mesh
    const tempMesh = new THREE.Mesh(geo);
    tempMesh.position.set(0, -0.5, 0);
    tempMesh.updateMatrixWorld(true);

    const camPos = new THREE.Vector3(CAM_X, CAM_Y, CAM_Z);
    const rayDir = new THREE.Vector3();
    const peakWorld = new THREE.Vector3();
    const visRaycaster = new THREE.Raycaster();

    const selectedPeaks: Peak[] = [];
    for (const pk of localMaxima) {
      peakWorld.set(pk.x, pk.y - 0.5, pk.z);
      rayDir.copy(peakWorld).sub(camPos).normalize();
      visRaycaster.set(camPos, rayDir);
      const hits = visRaycaster.intersectObject(tempMesh);
      if (hits.length > 0 && hits[0].point.distanceTo(peakWorld) < 0.3) {
        // Spread filter: reject if too close in xz to any already-selected candidate
        const tooClose = selectedPeaks.some((p) => {
          const dx = p.basePosition.x - pk.x;
          const dz = p.basePosition.z - pk.z;
          return Math.sqrt(dx * dx + dz * dz) < SPREAD_MIN;
        });
        if (!tooClose) {
          selectedPeaks.push({
            index: pk.index,
            basePosition: new THREE.Vector3(pk.x, pk.y, pk.z),
            originalHeight: pk.y,
            breathStrength: smoothstep(0.8, 4.5, pk.y),
          });
        }
      }
    }

    // Lock in the 8 final peaks by candidate letter index
    // Z=25, T=19, F=5, A=0, E=4, H=7, P=15, X=23
    const FINAL_CANDIDATE_INDICES = [25, 19, 5, 0, 4, 7, 15, 23];
    const finalPeaks = FINAL_CANDIDATE_INDICES
      .filter((i) => i < selectedPeaks.length)
      .map((i) => selectedPeaks[i]);

    // Wireframe
    const wfGeo = new THREE.WireframeGeometry(geo);

    // Store base wireframe positions and breath strengths
    const wfPos = wfGeo.attributes.position;
    const baseWfPos = new Float32Array(wfPos.array as Float32Array);
    const wfBStrength = new Float32Array(wfPos.count);
    for (let i = 0; i < wfPos.count; i++) {
      wfBStrength[i] = smoothstep(0.8, 4.5, baseWfPos[i * 3 + 1]);
    }
    baseWfPositionsRef.current = baseWfPos;
    wfBreathStrengthRef.current = wfBStrength;
    wfGeoRef.current = wfGeo;

    // Vertex colors
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

    return { solidGeo: geo, wfGeo, peaks: finalPeaks };
  }, []);

  useFrame(({ camera, clock }) => {
    // Camera
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(CAM_X, CAM_Y, CAM_Z);
    if (cam.fov !== FOV) {
      cam.fov = FOV;
      cam.updateProjectionMatrix();
    }
    cam.lookAt(LOOK_AT_X, LOOK_AT_Y, LOOK_AT_Z);

    // Tilt (halved range)
    if (groupRef.current && mouseRef.current) {
      const targetRotY = mouseRef.current.x * 0.09;
      const targetRotX = -mouseRef.current.y * 0.03;
      groupRef.current.rotation.y +=
        (targetRotY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x +=
        (targetRotX - groupRef.current.rotation.x) * 0.05;
    }

    // Cursor raycasting — camera-perp plane, then transform to group-local space
    if (mouseRef.current && groupRef.current) {
      _mouse.set(mouseRef.current.x, -mouseRef.current.y);
      _raycaster.setFromCamera(_mouse, cam);
      if (_raycaster.ray.intersectPlane(_cursorPlane, _intersection)) {
        _invMatrix.copy(groupRef.current.matrixWorld).invert();
        cursorLocalPosRef.current.copy(_intersection).applyMatrix4(_invMatrix);
      }
    }

    // Breathing — solid geometry
    const t = clock.getElapsedTime();
    const basePos = basePositionsRef.current;
    const bStr = breathStrengthRef.current;
    const sGeo = solidGeoRef.current;
    if (basePos && bStr && sGeo) {
      const arr = sGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < bStr.length; i++) {
        const s = bStr[i];
        if (s === 0) continue;
        const bx = basePos[i * 3];
        const bz = basePos[i * 3 + 2];
        const breath = Math.sin(t * breathingSpeed + bx * 0.4 + bz * 0.3) * 0.18 * s;
        const slowSwell = Math.sin(t * 0.25) * 0.06 * s;
        arr[i * 3 + 1] = basePos[i * 3 + 1] + breath + slowSwell;
      }
      sGeo.attributes.position.needsUpdate = true;
    }

    // Breathing — wireframe geometry
    const baseWfPos = baseWfPositionsRef.current;
    const wfBStr = wfBreathStrengthRef.current;
    const wGeo = wfGeoRef.current;
    if (baseWfPos && wfBStr && wGeo) {
      const arr = wGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < wfBStr.length; i++) {
        const s = wfBStr[i];
        if (s === 0) continue;
        const bx = baseWfPos[i * 3];
        const bz = baseWfPos[i * 3 + 2];
        const breath = Math.sin(t * breathingSpeed + bx * 0.4 + bz * 0.3) * 0.18 * s;
        const slowSwell = Math.sin(t * 0.25) * 0.06 * s;
        arr[i * 3 + 1] = baseWfPos[i * 3 + 1] + breath + slowSwell;
      }
      wGeo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
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
      <PeakLabels
        peaks={peaks}
        groupRef={groupRef}
        mouseRef={mouseRef}
        cursorLocalPosRef={cursorLocalPosRef}
        breathingSpeed={breathingSpeed}
      />
    </group>
  );
}
