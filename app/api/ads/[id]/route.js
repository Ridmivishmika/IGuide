import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { verifyJwtToken } from "@/lib/jwt";
import Ad from "@/models/Ad";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(request, context) {
  const { params } = context;
  await connect();

  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const ad = await Ad.findById(params.id);
    if (!ad) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "GET failed" }, { status: 500 });
  }
}

// import { writeFile } from "fs/promises";
// import path from "path";
// import { connect } from "@/lib/db";
// import { NextResponse } from "next/server";
// import Ad from "@/models/Ad";
// import mongoose from "mongoose";

export async function PUT(request, { params }) {
  await connect();

  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const imageFile = formData.get("image");

    let updateData = { name };

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);

      await writeFile(filePath, buffer);

      const imageUrl = `/uploads/${fileName}`;
      updateData.image = { url: imageUrl };
    }

    const updatedAd = await Ad.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    if (!updatedAd) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAd, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "PUT failed" }, { status: 500 });
  }
}


export async function DELETE(request, context) {
  const { params } = context;
  await connect();

  const accessToken = request.headers.get("authorization");
  const token = accessToken?.split(" ")[1];
  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await Ad.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Ad deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "DELETE failed" }, { status: 500 });
  }
}
