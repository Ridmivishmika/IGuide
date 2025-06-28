import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    user_name: { type: String, required: true },
    password: { type: String, required: true },

    // Role-based access: "owner" or "delegate"
    role: {
      type: String,
      enum: ["owner", "delegate"],
      default: "delegate",
    },

    // Indicates if the delegate is approved to log in
    isApproved: {
      type: Boolean,
      default: false, // ✨ Only approved users can log in
    },

    // For owners to manage their delegates
    delegates: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
