"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative h-[90vh] flex items-center justify-center text-center">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 bg-fixed bg-center bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b)",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 max-w-4xl px-6"
        >
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Built for <span className="text-red-500">Critical Moments</span>
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed">
            We connect donors, patients, and hospitals — when every second
            matters.
          </p>
        </motion.div>
      </section>

      {/* ================= STORY ================= */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-extrabold mb-6 dark:text-white">
              Our Story
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              In emergencies, blood shortages cost lives — not because donors
              don’t exist, but because they can’t be reached in time.
              <br />
              <br />
              We built this platform to remove friction, speed up connections,
              and bring transparency to a system that desperately needs it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-red-500/20 blur-[120px] rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1579154341098-e4e158cc7f55"
              className="relative rounded-3xl shadow-2xl"
              alt="Healthcare impact"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold mb-6 dark:text-white"
          >
            Why We Exist
          </motion.h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16">
            Because access to blood should never depend on luck, contacts, or
            chaos.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Speed",
                desc: "Real-time matching during emergencies",
              },
              {
                title: "Trust",
                desc: "Verified donors and hospitals only",
              },
              {
                title: "Transparency",
                desc: "Clear status updates, no guesswork",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-3xl bg-slate-50 dark:bg-slate-950 shadow-xl hover:-translate-y-2 transition"
              >
                <h3 className="text-2xl font-bold mb-4 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= IMPACT ================= */}
      <section className="py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-600 blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            ["2.5k+", "Active Donors"],
            ["120+", "Hospitals"],
            ["8.9k", "Lives Impacted"],
            ["15m", "Avg Response"],
          ].map(([num, label], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl font-black text-red-500 mb-2">{num}</div>
              <div className="uppercase tracking-widest text-slate-400 text-sm">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 bg-gradient-to-r from-red-600 to-red-700 text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-black mb-6"
        >
          Be Part of the Lifeline
        </motion.h2>

        <p className="max-w-2xl mx-auto text-lg mb-10 text-red-100">
          Whether you donate or request, you’re helping save lives when it
          matters most.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            href="/donations"
            className="bg-white text-red-600 px-10 py-4 rounded-full font-bold hover:scale-105 transition"
          >
            Donate Blood
          </Link>
          <Link
            href="/request"
            className="border border-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-red-600 transition"
          >
            Request Blood
          </Link>
        </div>
      </section>
    </main>
  );
}
