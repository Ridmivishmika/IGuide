import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import Ad from "@/models/Ad"; // Adjust if your model file is named Ads.js

export async function POST(req) {
  await connect();

  try {
    const body = await req.json();

    if (!body.name || !body.image?.url) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newAd = await Ad.create(body);
    return NextResponse.json(newAd, { status: 201 });
  } catch (error) {
    console.error("POST error (create ad):", error);
    return NextResponse.json({ message: "POST error (create ad)" }, { status: 500 });
  }
}

export async function GET() {
  await connect();

  try {
    const ads = await Ad.find({}).sort({ createdAt: -1 });
    return NextResponse.json(ads);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "GET error" }, { status: 500 });
  }
}
