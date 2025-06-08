import { NextResponse } from "next/server";
import ReferenceBook from "@/models/ReferenceBook";
import { connect } from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";
import { Languages } from "lucide-react";

export async function POST(req) {
  await connect();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyJwtToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    const { name, level, referenceBook,description } = body;

    if (!name || !level || !description|| !referenceBook?.id || !referenceBook?.url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newReferenceBook = await ReferenceBook.create({
      name,
      level,
      description,
      referenceBook
    });

    return NextResponse.json(newReferenceBook, { status: 201 });
  } catch (err) {
    console.error("POST /api/referenceBook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connect();

  try {
    const referenceBooks = await ReferenceBook.find();
    return NextResponse.json(referenceBooks, { status: 200 });
  } catch (err) {
    console.error("GET /api/referenceBooks error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
