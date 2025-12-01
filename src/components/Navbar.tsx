"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ProfileMenu } from "./ProfileMenu";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const pathname = usePathname() ?? "/";

  const isActive = (href: string) => {
    // exact match OR treat `/posts` as active for `/posts/slug`
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };
  return (
    <div>
      {/* Desktop Navbar */}
      <div className="bg-transparent flex justify-between items-center backdrop-blur-lg px-4 py-2 font-semibold text-lg sticky top-0">
        <Link href={"/"} className="flex justify-start items-center">
          <Image
            src={"https://www.bloodconnect.org/img/logo.png"}
            width={200}
            height={100}
            alt="logo"
          />
        </Link>

        <div className="flex justify-end items-center gap-x-4">
          <Link
            className={`${isActive("/donations") ? "text-red-500" : ""}`}
            href={"/donations"}
          >
            Donate
          </Link>
          <Link
            className={`${isActive("/request") ? "text-red-500" : ""}`}
            href={"/request"}
          >
            Request
          </Link>
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
