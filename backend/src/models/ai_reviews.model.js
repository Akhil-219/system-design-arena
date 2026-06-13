import mongoose, { mongo, Schema } from "mongoose";

const ai_reviewSchema = new Schema(
  {
    versionId:{
        type:Schema.Types.ObjectId,
        ref:"Version",
        unique:true,
        required:true
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    strengths: [
      {
        type: String,
        required: true,
      },
    ],
    weaknesses: [
      {
        type: String,
        required: true,
      },
    ],
    suggestions: [
      {
        type: String,
        required: true,
      },
    ],
    reviewText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Ai_review = mongoose.model("Ai_review", ai_reviewSchema);
