import { connect } from "@/lib/db";
import News from "@/models/News";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connect();
  try {
    const data = await req.json();
    const newNews = await News.create(data);
    return NextResponse.json(newNews, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function GET() {
  await connect();
  try {
    const allNews = await News.find();
    return NextResponse.json(allNews);
  } catch (err) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
