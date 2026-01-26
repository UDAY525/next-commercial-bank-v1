// components/ParallaxHero.tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ParallaxHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Background moves slower (parallax)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  // Text moves faster and fades out
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
          alt="Medical Lab"
          className="w-full h-full object-cover brightness-50"
        />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center text-white px-4"
      >
        <span className="uppercase tracking-[0.3em] text-red-500 font-bold mb-4 block">
          Save a Life Today
        </span>
        <h1 className="text-6xl md:text-8xl font-black mb-6">
          BLOOD BANK
          <br />
          RESERVE
        </h1>
        <div className="flex gap-4 justify-center">
          <button className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105">
            Get Started
          </button>
        </div>
      </motion.div>
    </section>
  );
}
