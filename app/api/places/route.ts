import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Place } from "@/models/Place";
import { adminGuard } from "@/lib/auth-guard";

/**
 * GET /api/places
 * Returns all places with optional filtering by type and search query.
 * Public access.
 */
export async function GET(request: Request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const query: any = {};
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const places = await Place.find(query).sort({ createdAt: -1 });
    const total = await Place.countDocuments(query);

    return NextResponse.json({ places, total });
  } catch (error: any) {
    console.error("GET Places Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch places" }, { status: 500 });
  }
}

/**
 * POST /api/places
 * Creates a new place.
 * Admin only.
 */
export async function POST(request: Request) {
  try {
    const { response } = await adminGuard(request);
    if (response) return response;

    await connectDb();
    const body = await request.json();

    const place = await Place.create(body);

    return NextResponse.json({ place }, { status: 201 });
  } catch (error: any) {
    console.error("POST Place Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create place" }, { status: 500 });
  }
}
