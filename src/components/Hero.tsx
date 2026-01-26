"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Background moves slower (parallax)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  // Text moves faster and fades out
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[110vh] w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background Layer */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />{" "}
        {/* Dark Overlay */}
        <img
          src="https://images.unsplash.com/photo-1615461066841-6116ecaaba7d?q=80&w=2000"
          alt="Blood Bank Laboratory"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content Layer */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-20 text-center text-white px-6"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1 rounded-full bg-red-600/20 border border-red-500 text-red-500 font-semibold mb-6 backdrop-blur-md"
        >
          Emergency Blood Reserve
        </motion.span>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8">
          LIFE IN YOUR <br /> <span className="text-red-600">VEINS.</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto text-slate-200 font-light leading-relaxed">
          Bridging the gap between donors and patients with a modern, real-time
          management ecosystem.
        </p>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-30" />
    </section>
  );
}
