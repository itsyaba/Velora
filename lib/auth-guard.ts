import { getAuth } from "./auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Reusable helper to protect admin API routes.
 * Checks for a valid session and the "admin" role.
 */
export async function requireAdmin(request?: Request) {
  const auth = await getAuth();
  
  // Use provided request headers or fallback to Next.js headers() for Server Components/Actions
  const session = await auth.api.getSession({
    headers: request ? request.headers : await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return session;
}

/**
 * Reusable helper to protect authenticated API routes.
 * Checks for a valid session for any role.
 */
export async function requireUser(request?: Request) {
  const auth = await getAuth();
  
  const session = await auth.api.getSession({
    headers: request ? request.headers : await headers(),
  });

  if (!session) {
    return null;
  }

  return session;
}

/**
 * Wrapper for API routes to handle the unauthorized response for any user.
 */
export async function userGuard(request: Request) {
  const session = await requireUser(request);
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, response: null };
}

/**
 * Wrapper for API routes to handle the unauthorized response automatically.
 */
export async function adminGuard(request: Request) {
  const session = await requireAdmin(request);
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, response: null };
}
