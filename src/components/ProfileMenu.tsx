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
      <Button asChild>
        <a href="/login" className="px-3 py-1">
          Login
        </a>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="p-1 bg-white">
          <Avatar>
            <AvatarImage
              src={user?.profileImage ?? "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
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

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/profile">Profile</a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/requests">Requests</a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/api/auth/signout">Log out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
