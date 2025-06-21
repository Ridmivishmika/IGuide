import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import Ad from "@/models/Ad";

export async function GET() {
  await connect();
  try {
    const ads = await Ad.find({}).sort({ createdAt: -1 });
    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "GET error" }, { status: 500 });
  }
}

export async function POST(req) {
  await connect();

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }

  try {
    const { title, description } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAd = await Ad.create(body);
    return NextResponse.json(newAd, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "POST error" }, { status: 500 });
  }
}
