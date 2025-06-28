import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import Ad from "@/models/Ad";

export async function PUT(req, { params }) {
  await connect();

  try {
    const id = params.id;
    const body = await req.json();

    const updatedAd = await Ad.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedAd);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "PUT error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connect();

  try {
    const id = params.id;
    await Ad.findByIdAndDelete(id);
    return NextResponse.json({ message: "Ad deleted" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "DELETE error" }, { status: 500 });
  }
}
