import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connect();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const owner = await User.findById(decoded.id);

    if (!owner || owner.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { delegateEmail } = await req.json();
    const delegate = await User.findOne({ email: delegateEmail });

    if (!delegate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    delegate.isApproved = true;
    await delegate.save();

    owner.delegates.push(delegate._id);
    await owner.save();

    return NextResponse.json({ message: "Access granted" }, { status: 200 });
  } catch (err) {
    console.error("Grant error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
