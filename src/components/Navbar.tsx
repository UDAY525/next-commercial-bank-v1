import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ProfileMenu } from "./ProfileMenu";

const Navbar = () => {
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
          <Link href={"/donations"}>Donate</Link>
          <Link href={"/request"}>Request</Link>
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
