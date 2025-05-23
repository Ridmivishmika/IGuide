import mongoose from "mongoose";

const PastPaperSchema = new mongoose.Schema(
  {
    id: {
      type: Number, // Use Number instead of int
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    level: {
      type: Number, // Use Number instead of int
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
     pastPaperPdfUrl: {
      type: String, // URL to the uploaded PDF
      required: true,
    },
  },
  { timestamps: true }
);

// Avoid Overwriting Existing Models
export default mongoose.models.PastPaper || mongoose.model("PastPaper", PastPaperSchema);
