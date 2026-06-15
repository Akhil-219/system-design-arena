import mongoose, { Schema } from "mongoose";

const aiReviewSchema = new Schema(
  {
    versionId: {
      type: Schema.Types.ObjectId,
      ref: "Version",
      required: true,
      unique: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    verdict: {
      type: String,
      enum: ["pass", "borderline", "fail"],
      required: true,
    },

    interviewRating: {
      type: String,
      enum: [
        "strong hire",
        "hire",
        "borderline",
        "no hire",
      ],
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    scaleAssessment: {
      type: String,
      required: true,
    },

    requirementCoverage: {
      covered: [
        {
          type: String,
        },
      ],

      missing: [
        {
          type: String,
        },
      ],

      partial: [
        {
          type: String,
        },
      ],
    },

    strengths: [
      {
        point: {
          type: String,
          required: true,
        },

        detail: {
          type: String,
          required: true,
        },
      },
    ],

    weaknesses: [
      {
        point: {
          type: String,
          required: true,
        },

        detail: {
          type: String,
          required: true,
        },
      },
    ],

    missedConcepts: [
      {
        concept: {
          type: String,
          required: true,
        },

        why: {
          type: String,
          required: true,
        },
      },
    ],

    componentFeedback: [
      {
        component: {
          type: String,
          required: true,
        },

        assessment: {
          type: String,
          enum: [
            "good",
            "acceptable",
            "flawed",
            "missing",
          ],
          required: true,
        },

        feedback: {
          type: String,
          required: true,
        },
      },
    ],

    improvements: [
      {
        priority: {
          type: String,
          enum: [
            "critical",
            "high",
            "medium",
            "low",
          ],
          required: true,
        },

        area: {
          type: String,
          required: true,
        },

        suggestion: {
          type: String,
          required: true,
        },
      },
    ],

    conceptualDepth: {
      type: String,
      enum: [
        "surface",
        "adequate",
        "deep",
        "exceptional",
      ],
      required: true,
    },

    tradeoffAwareness: {
      type: String,
      enum: [
        "none",
        "minimal",
        "moderate",
        "strong",
      ],
      required: true,
    },

    productionReadiness: {
      type: String,
      enum: [
        "not addressed",
        "partially addressed",
        "well addressed",
      ],
      required: true,
    },

    followUpQuestions: [
      {
        type: String,
      },
    ],

    reviewPromptVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const AiReview = mongoose.model(
  "AiReview",
  aiReviewSchema
);