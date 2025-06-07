import { NextResponse } from "next/server";
import Note from "@/models/Note";
import { connect } from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";

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

    const { name, level, year,language, note } = body;

    if (!name || !year || !level || !language || !note?.id || !note?.url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newNote = await Note.create({
      name,
      level,
      year,
      language,
      note,
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (err) {
    console.error("POST /api/note error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connect();

  try {
    const notes = await Note.find();
    return NextResponse.json(notes, { status: 200 });
  } catch (err) {
    console.error("GET /api/note error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
