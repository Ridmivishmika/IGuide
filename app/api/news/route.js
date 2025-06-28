import { connect } from "@/lib/db";
import News from "@/models/News";
import { NextResponse } from "next/server";

// POST to create new news
export async function POST(req) {
  await connect();
  try {
    const data = await req.json();

    // Validate required fields before create
    if (!data.name || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields: name and description" },
        { status: 400 }
      );
    }

    const newNews = await News.create(data);
    return NextResponse.json(newNews, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

// GET to fetch all news sorted by creation date
export async function GET() {
  await connect();
  try {
    const allNews = await News.find().sort({ createdAt: -1 });
    return NextResponse.json(allNews, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
