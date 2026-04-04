import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Provider } from "@/models/Provider";
import { adminGuard } from "@/lib/auth-guard";

/**
 * GET /api/providers
 * Returns all providers with optional filtering by category and availability.
 * Public access.
 */
export async function GET(request: Request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const available = searchParams.get("available");

    const query: any = {};
    if (category) query.category = category;
    if (available) query.available = available === "true";

    const providers = await Provider.find(query).sort({ createdAt: -1 });
    const total = await Provider.countDocuments(query);

    return NextResponse.json({ providers, total });
  } catch (error: any) {
    console.error("GET Providers Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch providers" }, { status: 500 });
  }
}

/**
 * POST /api/providers
 * Creates a new provider.
 * Admin only.
 */
export async function POST(request: Request) {
  try {
    const { response } = await adminGuard(request);
    if (response) return response;

    await connectDb();
    const body = await request.json();

    const provider = await Provider.create(body);

    return NextResponse.json({ provider }, { status: 201 });
  } catch (error: any) {
    console.error("POST Provider Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create provider" }, { status: 500 });
  }
}
