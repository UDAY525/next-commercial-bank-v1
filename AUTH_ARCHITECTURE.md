# Session & Auth Management - Senior Dev Approach

## Overview
All userId access is centralized in `src/lib/session.ts`, eliminating repetitive `auth()` calls across routes.

## Architecture

### 1. Session Utility (`src/lib/session.ts`)
```typescript
// Get userId anywhere (returns null if not authenticated)
const userId = await getUserId();

// Validate auth (returns userId or throws 401)
const userId = await requireAuth(); // throws if not auth'd
```

## Usage Patterns

### Pattern 1: Simple Validation
```typescript
// In any route handler
import { getUserId } from "@/lib/session";

export async function GET() {
  const userId = await getUserId();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // userId is guaranteed here
  const data = await User.findById(userId);
  return NextResponse.json({ data });
}
```

### Pattern 2: Advanced Handler Wrapper (Future)
```typescript
// For maximum DRY principle (optional)
import { withAuthHandler } from "@/lib/session";

export const GET = withAuthHandler(async (userId) => {
  // userId is guaranteed, no auth check needed
  const data = await User.findById(userId);
  return NextResponse.json({ data });
});
```

## Why This Approach?

✅ **Single Source of Truth** — All auth logic in one place (`session.ts`)
✅ **One Auth Call Per Request** — `getUserId()` efficiently calls `auth()` once
✅ **Consistent Error Handling** — Same 401 response across all routes
✅ **Type-Safe** — userId is string | null, explicit handling required
✅ **Testable** — Easy to mock `getUserId()` in tests
✅ **Scalable** — Add rate limiting, logging, roles in one utility
✅ **Session Cookie Based** — Uses NextAuth's secure HTTP-only cookies (built-in)

## Current Routes Using This

- `/api/donation` — GET & POST
- `/api/user` — GET & POST (profile management)

## Session Security

- ✅ Uses NextAuth's built-in secure session cookies (HTTP-only, signed)
- ✅ No need to expose userId in custom headers
- ✅ Works with proxy.ts middleware for page-level auth
- ✅ Automatically invalidated on logout

## Next Steps (Optional Improvements)

1. **Add caching** if userId is accessed multiple times per request:
```typescript
// In middleware context
const userId = await getUserId();
// Pass userId to routes instead of calling again
```

2. **Add roles/permissions**:
```typescript
export async function getUserWithRole() {
  const session = await auth();
  return { userId: session?.user?.id, role: session?.user?.role };
}
```

3. **Database session store** (if scaling to thousands of concurrent users):
- Move from JWT-based to database-backed sessions
- Still accessed via `getUserId()` — no code changes needed

## Files Modified

- `src/lib/session.ts` — Created (centralized auth utility)
- `src/app/api/donation/route.ts` — Refactored to use `getUserId()`
- `src/app/api/user/route.ts` — Refactored to use `getUserId()`

---

**Result**: Cleaner code, better performance, production-ready security. 🚀
