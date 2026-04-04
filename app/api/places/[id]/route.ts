import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Place } from "@/models/Place";
import { adminGuard } from "@/lib/auth-guard";

/**
 * PATCH /api/places/[id]
 * Updates a place's information.
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

    const place = await Place.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json({ place });
  } catch (error: any) {
    console.error("PATCH Place Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update place" }, { status: 500 });
  }
}

/**
 * DELETE /api/places/[id]
 * Deletes a place from the database.
 * Admin only.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { response } = await adminGuard(request);
    if (response) return response;

    await connectDb();
    const place = await Place.findByIdAndDelete(params.id);

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Place Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete place" }, { status: 500 });
  }
}
