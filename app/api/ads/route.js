// app/api/ads/route.js

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
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

  const accessToken = req.headers.get("authorization");
  const token = accessToken?.split(" ")[1];
  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newAd = await Ad.create(body);
    return NextResponse.json(newAd, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "POST error" }, { status: 500 });
  }
}
