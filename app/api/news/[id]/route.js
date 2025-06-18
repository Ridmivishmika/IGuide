import { connect } from "@/lib/db";
import News from "@/models/News";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  await connect();
  try {
    const news = await News.findById(params.id);
    if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(news);
  } catch (err) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connect();
  try {
    const data = await req.json();
    const updatedNews = await News.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(updatedNews);
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  await connect();
  try {
    await News.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
