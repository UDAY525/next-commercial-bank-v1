"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Stronger depth illusion
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgBlur = useTransform(scrollYProgress, [0, 1], ["0px", "6px"]);

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "120%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      data-testid="first-fold"
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background */}
      <motion.div
        style={{ y: bgY, scale: bgScale, filter: bgBlur }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
          alt="Medical Lab"
          className="w-full h-full object-cover brightness-50"
        />
      </motion.div>

      {/* Floating glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/30 blur-[120px] rounded-full" />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 text-center text-white px-4"
      >
        <span className="uppercase tracking-[0.35em] text-red-500 font-bold mb-6 block">
          Save a Life Today
        </span>

        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
          BLOOD BANK
          <br />
          RESERVE
        </h1>

        <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-200 mb-10">
          Real-time blood availability, faster grants, and a network that saves
          lives when every second counts.
        </p>

        <div className="flex gap-4 justify-center">
          <button className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-full font-bold transition-all hover:scale-105">
            Get Started
          </button>
          <button className="border border-white/40 hover:border-white px-10 py-4 rounded-full font-bold transition-all hover:bg-white hover:text-black">
            Learn More
          </button>
        </div>
      </motion.div>
    </section>
  );
}
