import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import Ad from "@/models/Ad";

// GET all ads (public)
export async function GET() {
  await connect();

  try {
    const ads = await Ad.find({}).sort({ createdAt: -1 });
    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    console.error("GET /api/ad error:", error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}

// POST new ad (public - no auth)
export async function POST(req) {
  await connect();

  try {
    const body = await req.json();

    // Optional: You can validate here if needed
    const { title, description } = body;
    if (!title || !description) {
      return NextResponse.json({ error: "Missing title or description" }, { status: 400 });
    }

    const newAd = await Ad.create(body);
    return NextResponse.json(newAd, { status: 201 });
  } catch (error) {
    console.error("POST /api/ad error:", error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}
