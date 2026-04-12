"use client";

import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import dynamic from "next/dynamic";

const Mountain = dynamic(() => import("./Mountain"), { ssr: false });

export default function Hero() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          style={{ background: "#000000" }}
        >
          <PerspectiveCamera
            makeDefault
            position={[0.1, 2.2, 6.3]}
            fov={59}
            onUpdate={(cam) => cam.lookAt(0.5, 1.5, -1.0)}
          />
          <Mountain mouseRef={mouseRef} />
        </Canvas>
      </div>
    </section>
  );
}
