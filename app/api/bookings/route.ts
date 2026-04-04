import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Provider } from "@/models/Provider";
import { adminGuard, userGuard } from "@/lib/auth-guard";

/**
 * GET /api/bookings
 * Admin only — returns all bookings with populated user and provider.
 */
export async function GET(request: Request) {
  try {
    const { response } = await adminGuard(request);
    if (response) return response;

    await connectDb();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate("providerId")
      .populate({
         path: "userId",
         model: "User", // Refers to Better-auth user collection
         select: "name email image"
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("GET Bookings Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch bookings" }, { status: 500 });
  }
}

/**
 * POST /api/bookings
 * Creates a new booking.
 * Authenticated users only.
 */
export async function POST(request: Request) {
  try {
    const { session, response } = await userGuard(request);
    if (response) return response;

    await connectDb();
    const body = await request.json();
    const { providerId, notes, scheduledAt } = body;

    if (!providerId || !scheduledAt) {
      return NextResponse.json({ error: "Provider ID and date are required" }, { status: 400 });
    }

    // Create the booking
    const booking = await Booking.create({
      userId: session.user.id,
      providerId,
      notes,
      scheduledAt: new Date(scheduledAt),
    });

    // Increment provider's total bookings
    await Provider.findByIdAndUpdate(providerId, {
      $inc: { totalBookings: 1 }
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: any) {
    console.error("POST Booking Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create booking" }, { status: 500 });
  }
}
