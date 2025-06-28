import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connect();

  try {
    const { name, email, user_name, password } = await req.json();

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Check if this is the first user (auto-owner)
    const existingUsers = await User.find({});
    const isFirstUser = existingUsers.length === 0;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with appropriate role and approval
    const newUser = new User({
      name,
      email,
      user_name,
      password: hashedPassword,
      isApproved: isFirstUser ? true : false,
      role: isFirstUser ? "owner" : "delegate"
    });

    await newUser.save();

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
