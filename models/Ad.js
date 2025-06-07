import mongoose from "mongoose";

const AdsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
   image: {
      id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ads || mongoose.model("Ads", AdsSchema);
