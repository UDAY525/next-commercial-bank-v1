import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top CTA */}
        <div className="mb-20 text-center">
          <h3 className="text-4xl font-extrabold text-white mb-4">
            Ready to Save Lives?
          </h3>
          <p className="max-w-xl mx-auto text-slate-400 mb-8">
            Join a growing network of donors, hospitals, and volunteers making
            healthcare faster and more reliable.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/donations"
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full font-bold text-white transition hover:scale-105"
            >
              Donate Blood
            </Link>
            <Link
              href="/request"
              className="border border-slate-500 hover:border-white px-8 py-4 rounded-full font-bold text-white transition hover:bg-white hover:text-slate-900"
            >
              Request Blood
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-700 mb-16" />

        {/* Footer Grid */}
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h4 className="text-2xl font-black text-white mb-4">
              Blood Bank Reserve
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              A real-time blood bank management platform connecting donors,
              hospitals, and patients when it matters most.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="text-white font-bold mb-4">Platform</h5>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/donations" className="hover:text-white transition">
                  Donate Blood
                </Link>
              </li>
              <li>
                <Link href="/request" className="hover:text-white transition">
                  Request Blood
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-white font-bold mb-4">Resources</h5>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white font-bold mb-4">Contact</h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Email: support@bloodbankreserve.org</li>
              <li>Phone: +91 90000 00000</li>
              <li>Available 24×7 for emergencies</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Blood Bank Reserve. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
