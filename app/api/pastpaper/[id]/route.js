// app/api/pastpaper/[id]/route.js
import Pastpaper from "@/models/Pastpaper";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ GET by ID
export async function GET(req, { params }) {
  await connect();
  try {
    const paper = await Pastpaper.findOne({ id: Number(params.id) });
    if (!paper) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(paper, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ UPDATE by ID
export async function PUT(req, { params }) {
  await connect();
  try {
    const updates = await req.json();
    const updated = await Pastpaper.findOneAndUpdate(
      { id: Number(params.id) },
      updates,
      { new: true }
    );
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE by ID
export async function DELETE(req, { params }) {
  await connect();
  try {
    const deleted = await Pastpaper.findOneAndDelete({ id: Number(params.id) });
    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
