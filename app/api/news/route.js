import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import News from "@/models/News";

export async function POST(req) {
  await connect();

  try {
    const formData = await req.formData();
    const id = parseInt(formData.get("id"));
    const name = formData.get("name");
    const description = formData.get("description");

    const newNews = await News.create({
      id,
      name,
      description
    });

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error("POST /api/news error:", error);
    return NextResponse.json({ error: "Failed to add news" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connect();
    const news = await News.find();
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error("GET /api/news error:", error);
    return NextResponse.json({ message: "Failed to fetch news" }, { status: 500 });
  }
}
