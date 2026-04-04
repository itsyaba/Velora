import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Provider } from "@/models/Provider";
import { adminGuard } from "@/lib/auth-guard";

/**
 * PATCH /api/providers/[id]
 * Updates a provider's information or toggles availability.
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

    const provider = await Provider.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json({ provider });
  } catch (error: any) {
    console.error("PATCH Provider Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update provider" }, { status: 500 });
  }
}

/**
 * DELETE /api/providers/[id]
 * Deletes a provider from the database.
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
    const provider = await Provider.findByIdAndDelete(params.id);

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Provider Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete provider" }, { status: 500 });
  }
}
