import mongoose from "mongoose";
import Note from "@/models/Note";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ GET note by ID
export async function GET(req, { params }) {
  await connect();

  try {
    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PATCH (update) note by ID
export async function PATCH(req, { params }) {
  await connect();

  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const updates = await req.json();

    const updatedNote = await Note.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE note by ID
export async function DELETE(req, { params }) {
  await connect();

  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
