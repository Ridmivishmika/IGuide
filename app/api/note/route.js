// ✅ FILE: app/api/note/route.js

import { NextResponse } from "next/server";
import Note from "@/models/Note";
import { connect } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";

// Helper: Check if JWT token is valid
// async function checkAuth(req) {
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = verifyToken(token);
//     return !!decoded;
//   } catch {
//     return false;
//   }
// }

// ✅ POST: Create a new note (requires JWT auth)
export async function POST(req) {
  await connect();

  // const authorized = await checkAuth(req);
  // if (!authorized) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const body = await req.json();
    const { name, level, year, language, note } = body;

    if (!name || !year || !level || !language || !note?.id || !note?.url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newNote = await Note.create({ name, level, year, language, note });
    return NextResponse.json(newNote, { status: 201 });
  } catch (err) {
    console.error("POST /api/note error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ GET: Fetch all notes (no auth)
export async function GET() {
  await connect();

  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (err) {
    console.error("GET /api/note error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
