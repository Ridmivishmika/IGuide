import User from "@/models/User";
import bcrypt from "bcrypt";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connect();
    const { name, email, user_name, password } = await req.json();

    // Check for existing user
    const isExisting = await User.findOne({ email });
    if (isExisting) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      user_name,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Server error during signup" },
      { status: 500 }
    );
  }
}
