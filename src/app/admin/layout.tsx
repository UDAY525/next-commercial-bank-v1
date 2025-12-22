"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  UserPen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  console.warn(pathname);
  return (
    <aside
      className={`
        relative flex flex-col border-r bg-white h-screen sticky top-0
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Header */}
      <div className="flex h-16 w-full items-center justify-between px-4 border-b">
        <h1
          className={`font-bold text-rose-500 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          Admin Console
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      {/* Menu Options */}
      <nav className="flex-1 p-3 space-y-2 overflow-x-hidden">
        {ADMIN_CONSOLE_MENU.map((item) => (
          <Link
            key={item.id}
            href={`/admin/${item.link}`}
            className={cn(
              "flex items-center gap-4 p-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group",
              pathname?.includes(item.link) &&
                "bg-rose-700 text-white hover:bg-rose-800 hover:text-white"
            )}
          >
            <div className="min-w-[24px] flex justify-center">{item.icon}</div>
            <span
              className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10 pointer-events-none"
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
