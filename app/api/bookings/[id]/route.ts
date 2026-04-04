import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { adminGuard } from "@/lib/auth-guard";

/**
 * PATCH /api/bookings/[id]
 * Updates a booking's status (confirm or cancel).
 * Admin only.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { response } = await adminGuard(request);
    if (response) return response;

    await connectDb();
    const body = await request.json();
    const { status } = body;

    if (!["confirmed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error: any) {
    console.error("PATCH Booking Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update booking" }, { status: 500 });
  }
}
