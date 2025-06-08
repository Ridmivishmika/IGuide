import mongoose from "mongoose";

const ReferenceBookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: Number, // Use Number instead of int
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    referenceBook: {
      id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      }
    }
  },
  { timestamps: true }
);

// Avoid Overwriting Existing Models
export default mongoose.models.ReferenceBook || mongoose.model("ReferenceBook", ReferenceBookSchema);
