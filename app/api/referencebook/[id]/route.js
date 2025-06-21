import mongoose from "mongoose";
import ReferenceBook from "@/models/ReferenceBook";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ GET by ID
export async function GET(req, { params }) {
  await connect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const book = await ReferenceBook.findById(id);
    if (!book) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("GET /api/referencebooks/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PATCH by ID (Partial update)
export async function PATCH(req, { params }) {
  await connect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const updates = await req.json();
    const updated = await ReferenceBook.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/referencebooks/[id] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ PUT by ID (Full update)
export async function PUT(req, { params }) {
  await connect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const updates = await req.json();
    const updated = await ReferenceBook.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/referencebooks/[id] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE by ID
export async function DELETE(req, { params }) {
  await connect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const deleted = await ReferenceBook.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/referencebooks/[id] error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
