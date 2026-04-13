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
          top: "-6%",
          left: "1%",
          width: "1400px",
          height: "1400px",
          borderRadius: "50%",
          background: `radial-gradient(
            circle at center,
            rgba(251, 146, 60, 0.83) 0%,
            rgba(234, 88, 12, 0.46) 40%,
            transparent 70%
          )`,
          filter: "blur(73px)",
          animation: "orb-pulse 8s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
