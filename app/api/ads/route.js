// http://localhost:3000/api/ads

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Ad from "@/models/Ad"; // Make sure model file is named correctly (Ad.js or Ads.js)

export async function POST(req) {
  await connect();

  const accessToken = req.headers.get("authorization");
  const token = accessToken?.split(" ")[1];

  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "Unauthorized (wrong or expired token)" }),
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const newAd = await Ad.create(body);

    return NextResponse.json(newAd, { status: 201 });
  } catch (error) {
    console.error("POST error (create ad):", error);
    return NextResponse.json({ message: "POST error (create ad)" }, { status: 500 });
  }
}

export async function GET(req) {
  await connect();

  try {
    const ads = await Ad.find({}).sort({ createdAt: -1 });

    return NextResponse.json(ads);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "GET error" }, { status: 500 });
  }
}
