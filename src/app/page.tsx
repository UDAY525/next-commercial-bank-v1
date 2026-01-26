import { auth } from "@/auth";
import ParallaxHero from "@/components/ParallaxHero";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="bg-slate-50 dark:bg-slate-950">
      <ParallaxHero />

      {/* Action Section: Overlapping the Hero */}
      <section className="relative z-20 -mt-20 px-4 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Donate Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-2xl overflow-hidden group">
            <div className="relative h-80 overflow-hidden rounded-2xl">
              <img
                src="https://fiinovation.co.in/wp-content/uploads/2022/06/Blood-Donation-%E2%80%93-India-Needs-A-Perception-Change.jpg?q=80&w=1000"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent" />
              <h2 className="absolute bottom-6 left-6 text-3xl font-bold text-white">
                Donate Blood
              </h2>
            </div>
            <div className="p-8">
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                Your contribution can be the difference between life and death.
                Join our registry of voluntary donors.
              </p>
              <Link
                href="/donations"
                className="block text-center border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-4 rounded-xl font-bold transition-all"
              >
                Become a Hero
              </Link>
            </div>
          </div>

          {/* Request Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-2xl overflow-hidden group">
            <div className="relative h-80 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?q=80&w=1000"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
              <h2 className="absolute bottom-6 left-6 text-3xl font-bold text-white">
                Ask for a Grant
              </h2>
            </div>
            <div className="p-8">
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                Urgent requirement? Our platform helps you connect with nearby
                donors and hospitals in real-time.
              </p>
              <Link
                href="/request"
                className="block text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-4 rounded-xl font-bold transition-all"
              >
                Request Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* High-Impact Statistics Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-red-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          <div>
            <div className="text-5xl font-black text-red-500 mb-2">2.5k+</div>
            <div className="text-slate-400 uppercase tracking-widest text-sm">
              Active Donors
            </div>
          </div>
          <div>
            <div className="text-5xl font-black text-red-500 mb-2">120+</div>
            <div className="text-slate-400 uppercase tracking-widest text-sm">
              Hospitals
            </div>
          </div>
          <div>
            <div className="text-5xl font-black text-red-500 mb-2">8.9k</div>
            <div className="text-slate-400 uppercase tracking-widest text-sm">
              Lives Saved
            </div>
          </div>
          <div>
            <div className="text-5xl font-black text-red-500 mb-2">15m</div>
            <div className="text-slate-400 uppercase tracking-widest text-sm">
              Response Time
            </div>
          </div>
        </div>
      </section>

      <HorizontalMarquee />
    </main>
  );
}

const GALLERY_IMAGES = [
  {
    src: "https://hrdiagnostic.in/blog/wp-content/uploads/2025/02/Diagnostic-Centres.webp",
    label: "Advanced Diagnostic Labs",
  },
  {
    src: "https://as1.ftcdn.net/jpg/06/64/09/46/1000_F_664094661_D34x82IezIMuVd2zFFvltmggrcQljZnr.jpg",
    label: "Life-Saving Blood Storage",
  },
  {
    src: "https://pxacademy.com/wp-content/uploads/2018/09/o6rvc40-min.jpg",
    label: "Patient-First Care",
  },
  {
    src: "https://etimg.etb2bimg.com/photo/100933327.cms",
    label: "Cutting-Edge Research",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThy994-dsBSSj3kYvPEmkRJR3nReRQ3jWg6g&s",
    label: "Trusted Medical Experts",
  },
  {
    src: "https://gointernationally.com/wp-content/uploads/2013/07/canstockphoto21582831.jpg",
    label: "World-Class Facilities",
  },
];

export function HorizontalMarquee() {
  const duplicatedImages = [...GALLERY_IMAGES, ...GALLERY_IMAGES];

  return (
    <section className="py-28 bg-white dark:bg-slate-950 overflow-hidden border-y border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="mb-14 px-6 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">
          Our Impact in Action
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Powering healthcare innovation through precision, safety, and trust —
          across hospitals, labs, and research centers worldwide.
        </p>
      </div>

      {/* Marquee */}
      <div className="relative flex overflow-hidden group">
        {/* Gradient fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />

        <div className="animate-marquee-infinite flex gap-10 py-6">
          {duplicatedImages.map((img, index) => (
            <div
              key={index}
              className="w-[420px] h-[300px] flex-shrink-0 relative overflow-hidden rounded-3xl shadow-xl bg-slate-100 dark:bg-slate-900 transition-transform duration-500 hover:scale-[1.06]"
            >
              <img
                src={img.src}
                alt={img.label}
                loading="lazy"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white text-lg font-semibold tracking-wide">
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
