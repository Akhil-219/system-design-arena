// Defensive layer between the raw AI response and the AiReview schema.
// LLMs occasionally drift on enum wording even with an explicit prompt
// (e.g. returning "poor" instead of "flawed"). Rather than let a Mongoose
// validation error 500 the whole save flow, we coerce known synonyms onto
// the closest valid enum value and fall back to a safe default otherwise.

const ASSESSMENT_MAP = {
  good: "good",
  acceptable: "acceptable",
  ok: "acceptable",
  okay: "acceptable",
  flawed: "flawed",
  poor: "flawed",
  bad: "flawed",
  weak: "flawed",
  missing: "missing",
  absent: "missing",
  none: "missing",
};

const PRIORITY_MAP = {
  critical: "critical",
  high: "high",
  medium: "medium",
  moderate: "medium",
  low: "low",
};

const VERDICT_MAP = {
  pass: "pass",
  borderline: "borderline",
  fail: "fail",
};

const INTERVIEW_RATING_MAP = {
  "strong hire": "strong hire",
  hire: "hire",
  borderline: "borderline",
  "no hire": "no hire",
};

const CONCEPTUAL_DEPTH_MAP = {
  surface: "surface",
  adequate: "adequate",
  deep: "deep",
  exceptional: "exceptional",
};

const TRADEOFF_AWARENESS_MAP = {
  none: "none",
  minimal: "minimal",
  moderate: "moderate",
  strong: "strong",
};

const PRODUCTION_READINESS_MAP = {
  "not addressed": "not addressed",
  "partially addressed": "partially addressed",
  "well addressed": "well addressed",
};

function coerce(map, value, fallback) {
  if (typeof value !== "string") return fallback;
  const normalized = map[value.trim().toLowerCase()];
  return normalized ?? fallback;
}

export function normalizeAiReview(raw) {
  return {
    ...raw,
    score: Math.min(100, Math.max(0, Number(raw.score) || 0)),
    verdict: coerce(VERDICT_MAP, raw.verdict, "borderline"),
    interviewRating: coerce(INTERVIEW_RATING_MAP, raw.interviewRating, "borderline"),
    conceptualDepth: coerce(CONCEPTUAL_DEPTH_MAP, raw.conceptualDepth, "adequate"),
    tradeoffAwareness: coerce(TRADEOFF_AWARENESS_MAP, raw.tradeoffAwareness, "minimal"),
    productionReadiness: coerce(PRODUCTION_READINESS_MAP, raw.productionReadiness, "not addressed"),
    componentFeedback: (raw.componentFeedback || []).map((cf) => ({
      ...cf,
      assessment: coerce(ASSESSMENT_MAP, cf.assessment, "acceptable"),
    })),
    improvements: (raw.improvements || []).map((imp) => ({
      ...imp,
      priority: coerce(PRIORITY_MAP, imp.priority, "medium"),
    })),
  };
}
