import { NextResponse } from "next/server";
import Pastpaper from "@/models/Pastpaper";
import { connect } from "@/lib/db";

export async function POST(req) {
  await connect();

  try {
    const body = await req.json();

    const { name, level, year, language, pdf } = body;

    // Basic validation
    if (!name || !year || !level || !language || !pdf?.id || !pdf?.url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPaper = await Pastpaper.create({
      name,
      level,
      year,
      language,
      pdf,
    });

    return NextResponse.json(newPaper, { status: 201 });
  } catch (err) {
    console.error("POST /api/pastpaper error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connect();

  try {
    const papers = await Pastpaper.find();
    return NextResponse.json(papers, { status: 200 });
  } catch (err) {
    console.error("GET /api/pastpaper error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
