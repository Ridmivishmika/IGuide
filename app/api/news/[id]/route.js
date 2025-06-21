import { connect } from "@/lib/db";
import News from "@/models/News";
import { NextResponse } from "next/server";

// GET single news item by ID
export async function GET(_, { params }) {
  await connect();
  try {
    const news = await News.findById(params.id);
    if (!news) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(news, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// UPDATE a news item
export async function PUT(req, { params }) {
  await connect();
  try {
    const data = await req.json();
    const updatedNews = await News.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedNews) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updatedNews, { status: 200 });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE a news item
export async function DELETE(_, { params }) {
  await connect();
  try {
    const deleted = await News.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
