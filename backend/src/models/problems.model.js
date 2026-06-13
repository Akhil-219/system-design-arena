import mongoose, { Schema } from "mongoose";

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    constraints: [
      {
        type: String,
        required: true,
      },
    ],
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    referenceComponents: [
      {
        type: String,
        required: true,
      },
    ],
    difficulty: {
      type: String,
      enum:["Easy","Medium","Hard"],
      required: true,
    },
  },
  { timestamps: true },
);

export const Problem = mongoose.model("Problem", problemSchema);
