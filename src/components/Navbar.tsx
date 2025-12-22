"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { ProfileMenu } from "./ProfileMenu";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/donations", label: "Donate" },
  { href: "/request", label: "Request" },
  { href: "/about", label: "About" },
];

function NavLink({
  href,
  children,
  active,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "px-3 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
        active
          ? "bg-red-600 text-white shadow-sm"
          : "text-gray-800 hover:bg-red-50 hover:text-red-700"
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (pathname.includes("admin")) return null;

  return (
    <header className="fixed w-full top-0 z-50 overflow-hidden">
      <div
        className="backdrop-blur-sm bg-trnaparent/70 dark:bg-slate-900/60 border-b border-white/10
                   shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-36 h-auto relative">
                  <img
                    src="https://www.bloodconnect.org/img/logo.png"
                    alt="BloodConnect"
                    className="object-contain"
                  />
                </div>
              </Link>
              {/* Optional tagline on larger screens */}
              <span className="hidden md:inline-block text-sm text-gray-600 dark:text-gray-300">
                Donate. Save lives.
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    active={isActive(item.href)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="m-4">
                <ProfileMenu />
              </div>
            </nav>

            {/* Mobile controls */}
            <div className="flex items-center md:hidden gap-x-2">
              <ProfileMenu />
              <button
                onClick={() => setOpen((s) => !s)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="p-2 rounded-md inline-flex items-center justify-center text-gray-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {/* Hamburger / X icon */}
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  {open ? (
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M3 7h18M3 12h18M3 17h18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          className={clsx(
            "md:hidden transform-gpu transition-all bg-gray-50 relative w-full duration-300 ease-in-out overflow-hidden",
            open ? "h-screen opacity-100" : "hidden"
          )}
        >
          <div className="px-4 pt-2 pb-6 flex flex-col space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={isActive(item.href)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
