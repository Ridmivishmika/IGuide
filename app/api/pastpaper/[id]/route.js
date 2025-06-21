import mongoose from "mongoose";
import Pastpaper from "@/models/Pastpaper";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ GET a past paper by ID
export async function GET(req, { params }) {
  await connect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const paper = await Pastpaper.findById(id);
    if (!paper) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(paper, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PATCH (partial update) a past paper by ID
export async function PATCH(req, { params }) {
  await connect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const updates = await req.json();
    const updated = await Pastpaper.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ PUT (full update) a past paper by ID
export async function PUT(req, { params }) {
  await connect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const updates = await req.json();
    const updated = await Pastpaper.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE a past paper by ID
export async function DELETE(req, { params }) {
  await connect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const deleted = await Pastpaper.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
