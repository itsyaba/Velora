import { headers } from "next/headers";
import { z } from "zod";
import { getAuth } from "@/lib/auth";
import { Booking } from "@/lib/models/booking";
import { Provider } from "@/lib/models/provider";

const bodySchema = z.object({
  providerId: z.string().min(1),
});

export async function POST(req: Request) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const { providerId } = parsed.data;
  const exists = await Provider.exists({ _id: providerId });
  if (!exists) {
    return Response.json({ error: "Provider not found" }, { status: 404 });
  }

  const booking = await Booking.create({
    userId: session.user.id,
    providerId,
    status: "pending",
  });

  return Response.json({
    ok: true,
    bookingId: booking._id.toString(),
  });
}
