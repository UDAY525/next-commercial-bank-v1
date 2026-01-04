"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  UserPen,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MotionBackground } from "@/components/admin/MotionBackground";

const ADMIN_CONSOLE_MENU = [
  {
    id: 1,
    name: "Edit Access",
    link: "user-access-edit",
    icon: <UserPen size={22} />,
  },
  {
    id: 2,
    name: "Dashboard",
    link: "dashboard",
    icon: <LayoutDashboard size={22} />,
  },
  { id: 3, name: "Grants", link: "grant", icon: <HeartHandshake size={22} /> },
];

export function AdminSidebar() {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 md:static md:z-auto",
          "h-screen bg-white border-r",
          "transition-all duration-300 ease-in-out",
          // desktop width
          isOpen ? "md:w-64" : "md:w-20",
          // mobile slide
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "w-64"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-16 items-center px-4 border-b",
            isOpen || mobileOpen ? "justify-between" : "justify-center"
          )}
        >
          <h1
            className={cn(
              "font-bold text-rose-500 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
              mobileOpen || isOpen
                ? "max-w-[200px] translate-x-0 animate-in slide-in-from-left-2 delay-150"
                : "max-w-0 -translate-x-4 md:pointer-events-none"
            )}
          >
            Admin Console
          </h1>

          {/* Desktop toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            {isOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-2 overflow-hidden">
          {ADMIN_CONSOLE_MENU.map((item) => {
            const active = pathname.includes(item.link);

            return (
              <Link
                key={item.id}
                href={`/admin/${item.link}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center  p-3 rounded-xl",
                  "transition-all duration-200",
                  active
                    ? "bg-rose-700 text-white"
                    : "text-slate-600 hover:bg-rose-50 hover:text-rose-600",
                  mobileOpen || isOpen ? "gap-4" : "justify-center"
                )}
              >
                <div className="min-w-6 flex justify-center">{item.icon}</div>

                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap overflow-hidden",
                    "transition-all duration-300 ease-out",
                    mobileOpen || isOpen
                      ? "max-w-40 translate-x-0 scale-100 delay-150"
                      : "max-w-0 hidden -translate-x-2 scale-95 md:pointer-events-none"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 left-6 z-40 md:hidden p-4 rounded-full bg-rose-600 text-white shadow-lg"
      >
        <PanelLeftOpen size={22} />
      </button>
    </>
  );
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full  text-slate-900 overflow-hidden">
      <MotionBackground />

      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
