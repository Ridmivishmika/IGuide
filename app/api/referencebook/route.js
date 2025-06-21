import { NextResponse } from "next/server";
import ReferenceBook from "@/models/ReferenceBook";
import { connect } from "@/lib/db";

// ✅ POST a new reference book (no auth)
export async function POST(req) {
  await connect();

  try {
    const body = await req.json();
    const { name, level, description, referenceBook } = body;

    if (!name || !level || !description || !referenceBook?.id || !referenceBook?.url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newReferenceBook = await ReferenceBook.create({
      name,
      level,
      description,
      referenceBook,
    });

    return NextResponse.json(newReferenceBook, { status: 201 });
  } catch (err) {
    console.error("POST /api/referenceBooks error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ GET all reference books (no auth)
export async function GET() {
  await connect();

  try {
    const referenceBooks = await ReferenceBook.find().sort({ createdAt: -1 });
    return NextResponse.json(referenceBooks, { status: 200 });
  } catch (err) {
    console.error("GET /api/referenceBooks error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
