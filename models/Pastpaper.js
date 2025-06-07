import mongoose from "mongoose";

const PastPaperSchema = new mongoose.Schema(
  {
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
    
    language: {
      type: String,
      required: true,
    },
    pdf: {
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
export default mongoose.models.PastPaper || mongoose.model("PastPaper", PastPaperSchema);
