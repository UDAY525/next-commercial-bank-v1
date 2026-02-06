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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
    p-1 rounded-full
    hover:bg-slate-200/60 dark:hover:bg-slate-800/60
    focus-visible:ring-2 focus-visible:ring-red-500/40
    transition
  "
        >
          <img
            src={user?.profileImage?.toString()}
            alt={session.user.name ?? "avatar"}
            className="h-8 w-8 rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="
    w-64
    rounded-xl
    border border-slate-200 dark:border-slate-800
    bg-white dark:bg-slate-900
    shadow-xl
    text-slate-900 dark:text-slate-100 mr-4
  "
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
          <Link
            href="/profile"
            className="
      flex items-center gap-2
      rounded-md px-3 py-2
      font-medium
      hover:bg-slate-100 dark:hover:bg-slate-800
      focus:bg-slate-100 dark:focus:bg-slate-800
      transition
    "
          >
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/request" className="font-medium">
            Requests
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-400/50" />
        <DropdownMenuItem asChild>
          <Link
            href="/admin/grant"
            className="
      flex items-center gap-2
      rounded-md px-3 py-2
      font-medium
      text-indigo-600 dark:text-indigo-400
      hover:bg-indigo-50 dark:hover:bg-indigo-900/30
      transition
    "
          >
            <ShieldUser className="h-6 w-6" />
            Admin
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
      flex items-center gap-2 w-full
      rounded-md px-3 py-2
      font-medium
      text-red-600 dark:text-red-400
      hover:bg-red-50 dark:hover:bg-red-900/30
      transition
    "
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
