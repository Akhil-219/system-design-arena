import mongoose, { Schema } from "mongoose";

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
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
      enum:["easy","medium","hard"],
      required: true,
    },
  },
  { timestamps: true },
);

problemSchema.index({
    title: "text",
    description: "text"
});
problemSchema.index({ slug: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });

export const Problem = mongoose.model("Problem", problemSchema);
