"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState } from "react";

export function MotionBackground() {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  // High-inertia springs for that "Admin Dashboard" premium feel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, { stiffness: 15, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 15, damping: 20 });

  // Separate Effect for mounting logic to avoid cascading sync updates
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Separate Effect for Event Listeners
  useEffect(() => {
    if (reduceMotion || !isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate offset based on center of screen
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 160;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 160;

      mouseX.set(xNorm);
      mouseY.set(yNorm);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMounted, mouseX, mouseY, reduceMotion]);

  // Don't render until mounted to prevent hydration mismatch (SSR)
  if (!isMounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50/50"
    >
      {/* Liquid Mesh Filter Definition */}
      <svg className="absolute h-0 w-0">
        <filter id="admin-liquid">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            seed="2"
          >
            <animate
              attributeName="baseFrequency"
              values="0.012;0.018;0.012"
              dur="30s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="40" />
        </filter>
      </svg>

      {/* Animated Color Orbs */}
      <motion.div
        style={{ x, y }}
        className="absolute inset-0 flex items-center justify-center filter blur-[100px] saturate-[1.4]"
      >
        {/* Soft Red Orb */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-[70vw] w-[70vw] rounded-full bg-red-100/30 mix-blend-multiply"
          style={{ top: "-10%", left: "-5%" }}
        />

        {/* Soft Green Orb */}
        <motion.div
          animate={{
            scale: [1.15, 1, 1.15],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-[80vw] w-[80vw] rounded-full bg-emerald-50/40 mix-blend-multiply"
          style={{ bottom: "-15%", right: "-5%" }}
        />
      </motion.div>

      {/* The "Liquid" Surface Layer */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.08) 0%, transparent 40%)
          `,
          filter: "url(#admin-liquid)",
          backgroundSize: "100% 100%",
        }}
      />

      {/* Structural Admin Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Final Glass Shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 backdrop-blur-[1.5px]" />
    </div>
  );
}
