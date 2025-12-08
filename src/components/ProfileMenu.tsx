"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User as UserType } from "@/models/User";
import Link from "next/link";
import useGetUserFromDB from "@/hooks/useGetUserFromDB";
import { signOut, signIn } from "next-auth/react";
import { LogOut, LockKeyholeOpen, ShieldUser } from "lucide-react";

export function ProfileMenu() {
  const { data: session, status } = useSession();

  const user = useGetUserFromDB();

  // Show nothing (or a placeholder) if not signed in
  if (status === "loading") {
    return (
      <Button variant="ghost" className="p-1">
        <div className="h-8 w-8 rounded-full bg-slate-200/60 flex items-center justify-center">
          …
        </div>
      </Button>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <>
        <Button
          variant="secondary"
          onClick={() => signIn()}
          className="
    group                      /* for hover animations on children */
    relative overflow-hidden    /* for shine effect */
     items-center justify-center gap-3 
    w-full
    text-red-700 font-semibold text-base
    px-4 lg:px-6 py-4
    bg-gradient-to-r from-red-600 to-rose-600
    text-white
    border border-red-500/30
    rounded-xl
    shadow-lg shadow-red-500/20
    hover:shadow-xl hover:shadow-red-500/30
    hover:from-red-700 hover:to-rose-700
    hover:scale-[1.02]
    focus-visible:scale-[1.02]
    transition-all duration-300 ease-out
    focus-visible:ring-4 focus-visible:ring-red-400/40
    focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hidden lg:flex
  "
        >
          {/* Optional shining effect on hover */}
          <span
            className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent 
                   group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"
          />

          <span className="bg-white p-1 rounded-full hidden lg:flex">
            <LockKeyholeOpen size={64} strokeWidth={2.5} color="red" />
          </span>

          <span className="tracking-wider">LOGIN</span>
        </Button>

        <Button
          className="lg:hidden flex font-semibold bg-gradient-to-r from-red-600 to-rose-600 text-white"
          onClick={() => signIn()}
        >
          LOGIN
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="p-1 bg-transparent no-ring">
          <Avatar>
            {user?.profileImage ? (
              <img
                src={user?.profileImage?.toString()}
                alt={session.user.name ?? "avatar"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <AvatarFallback>CN</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-gray-300/5 border-gray-200 backdrop-blur-xl"
        align="end"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <div className="px-2 py-2">
          <div className="font-medium">{session.user.name}</div>
          <div className="text-xs text-muted-foreground">
            {session.user.email}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gray-300/50" />
        <DropdownMenuItem asChild>
          <a href="/profile">Profile</a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/requests">Requests</a>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-400/50" />
        <DropdownMenuItem asChild>
          <Link
            className="ring-0 outline-0 text-green-600 font-semibold w-full focus-visible:none no-ring"
            href={"/admin"}
          >
            <ShieldUser className="!w-6 !h-6" />
            Admin
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            variant={"secondary"}
            className="ring-0 outline-0 text-red-500 font-semibold focus-visible:none no-ring"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut />
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
