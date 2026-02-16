import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const loginRequiredPrefix = ["/profile", "/donations", "/request"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  if (session && session.user && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (
    loginRequiredPrefix.some((prefix) => pathname.startsWith(prefix)) &&
    !session?.user
  ) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/donations/:path*",
    "/request/:path*",
    "/login",
  ],
};
