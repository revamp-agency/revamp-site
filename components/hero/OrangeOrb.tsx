"use client";

export default function OrangeOrb() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <div
        style={{
          position: "absolute",
          top: "-16%",
          left: "1%",
          width: "1400px",
          height: "1400px",
          borderRadius: "50%",
          background: `radial-gradient(
            circle at center,
            rgba(251, 146, 60, 1.00) 0%,
            rgba(234, 88, 12, 0.64) 40%,
            transparent 70%
          )`,
          filter: "blur(73px) brightness(1.15) saturate(1.00)",
          animation: "orb-pulse 8s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
