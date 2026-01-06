import { auth } from "@/auth";
import connectDB from "@/connectDB";
import User from "@/models/User";
import { NextResponse } from "next/server";

/**
 * Get the current user ID from the session.
 * This should be called once per request and cached in middleware/route context.
 * Returns the userId or null if not authenticated.
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function isUserAdmin() {
  const session = await auth();
  if (!session || !session?.user) return false;

  try {
    await connectDB();
    const isAdmin = await User.findOne({
      email: session.user?.email,
      role: "admin",
    }).lean();

    console.warn("Is Admin:", isAdmin);

    return isAdmin;
  } catch (error) {}
}

/**
 * Middleware helper to validate authentication and return userId.
 * Use this in route handlers to avoid multiple auth() calls.
 * Returns userId or a 401 error response if not authenticated.
 */
export async function requireAuth(): Promise<string | { error: NextResponse }> {
  const userId = await getUserId();

  if (!userId) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - no session found" },
        { status: 401 }
      ),
    };
  }

  return userId;
}

/**
 * Type-safe helper for route handlers.
 * Validates auth and passes userId to the handler.
 * Usage: export const POST = withAuthHandler(async (userId) => { ... })
 */
export function withAuthHandler(
  handler: (userId: string) => Promise<NextResponse>
) {
  return async () => {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - no session found" },
        { status: 401 }
      );
    }

    return handler(userId);
  };
}
