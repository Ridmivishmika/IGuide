import mongoose from "mongoose";
import Note from "@/models/Note";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ GET a single note by ID (no auth)
export async function GET(req, { params }) {
  await connect();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("GET /api/note/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PATCH (update) a note by ID (no auth)
export async function PATCH(req, { params }) {
  await connect();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const updates = await req.json();
    const updatedNote = await Note.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/note/[id] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE a note by ID (no auth)
export async function DELETE(req, { params }) {
  await connect();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/note/[id] error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
