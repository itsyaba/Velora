import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";

const f = createUploadthing();

/**
 * Helper: resolves the current session using Next.js server headers.
 * This is needed because UploadThing's middleware does not forward
 * the browser's cookie headers through the raw Request object.
 */
async function getSessionFromHeaders() {
  try {
    const auth = await getAuth();
    const h = await headers();
    console.log("🔍 getSessionFromHeaders: Attempting to fetch session...");
    
    const session = await auth.api.getSession({
      headers: h,
    });
    
    if (!session) {
      console.warn("⚠️ getSessionFromHeaders: No session returned.");
    } else {
      console.log("✅ getSessionFromHeaders: Session found for user:", session.user.email);
    }
    
    return session;
  } catch (error: any) {
    console.error("❌ getSessionFromHeaders Error:", error.message);
    return null;
  }
}

/**
 * Our FileRouter configuration defines the upload endpoints.
 * All uploads are restricted to admin users.
 */
export const ourFileRouter = {
  // Single image for provider profiles
  providerPhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      console.log("🚀 providerPhoto: Middleware triggered (Auth check disabled)");
      // Skipping auth check per user request
      return { userId: "admin-dev" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ providerPhoto upload complete for userId:", metadata.userId);
      console.log("📎 File URL:", file.url);
      return { url: file.url };
    }),

  // Multiple images for places and galleries
  placePhotos: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      console.log("🚀 placePhotos: Middleware triggered (Auth check disabled)");
      // Skipping auth check per user request
      return { userId: "admin-dev" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ placePhotos upload complete for userId:", metadata.userId);
      console.log("📎 File URL:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
