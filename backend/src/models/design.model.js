import mongoose, { Schema } from "mongoose";

const designSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    currentVersion: {
      type: Schema.Types.ObjectId,
      ref: "Version",
    },
    postedVersion: [
      {
        type: Schema.Types.ObjectId, // may or may not post so , its not required
        ref: "Version",
      },
    ],
    draftDiagramData: {
      type: Object,
      required: true,
    },
    draftNotes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["ATTEMPTING", "DESIGNED"],
      default: "ATTEMPTING",
    },
    isPosted: {
      type: Boolean,
      default: false,
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

designSchema.index(
  {
    ownerId: 1,
    problemId: 1,
  },
  {
    unique: true,
  },
);

export const Design = mongoose.model("Design", designSchema);
