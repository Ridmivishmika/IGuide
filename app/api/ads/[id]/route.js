import Ad from "@/models/Ad"; // Adjust the path if needed
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

// GET Ad by ID
export async function GET(req, { params }) {
  await connect();
  try {
    const ad = await Ad.findById(params.id);
    if (!ad) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH Ad by ID
export async function PATCH(req, { params }) {
  await connect();
  try {
    const updates = await req.json();
    const updated = await Ad.findByIdAndUpdate(params.id, updates, { new: true });
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// PUT Ad by ID
export async function PUT(req, { params }) {
  await connect();
  try {
    const updates = await req.json();
    const updated = await Ad.findByIdAndUpdate(params.id, updates, { new: true });
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE Ad by ID
export async function DELETE(req, { params }) {
  await connect();
  try {
    const deleted = await Ad.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
