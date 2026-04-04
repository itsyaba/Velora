import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

/**
 * Next.js API route for UploadThing integration.
 * Handles the upload requests from the client.
 */
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
