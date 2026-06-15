import { AiReview } from "../models/ai_reviews.model.js";
import { Version } from "../models/versions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Design } from "../models/design.model.js";
import { Problem } from "../models/problems.model.js";
import buildReviewPromptV1 from "../utils/aiReviewPrompt.js";
import { generateAiReview } from "../utils/generateAiReview.js";

const generateReview = async ({ versionId, userId }) => {
  const version = await Version.findById(versionId);
  if (!version) {
    throw new ApiError(404, "Version not found");
  }
  if (version.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorised Access");
  }

  const existingReview = await AiReview.findOne({ versionId: version._id });
  if (existingReview) {
    throw new ApiError(409, "Response already generated");
  }

  const problem = await Problem.findById(version.problemId);
  // ai call on the version and populate the reivew
    const prompt = "Return JSON: {\"message\":\"hello\"}";// to be changed
  const aiResponse = await generateAiReview(prompt);
  console.log(aiResponse);
  
  const review = await AiReview.create({
    versionId: version._id,

    score: aiResponse.score,
    verdict: aiResponse.verdict,
    interviewRating: aiResponse.interviewRating,

    summary: aiResponse.summary,
    scaleAssessment: aiResponse.scaleAssessment,

    requirementCoverage: aiResponse.requirementCoverage,

    strengths: aiResponse.strengths,

    weaknesses: aiResponse.weaknesses,

    missedConcepts: aiResponse.missedConcepts,

    componentFeedback: aiResponse.componentFeedback,

    improvements: aiResponse.improvements,

    conceptualDepth: aiResponse.conceptualDepth,

    tradeoffAwareness: aiResponse.tradeoffAwareness,

    productionReadiness: aiResponse.productionReadiness,

    followUpQuestions: aiResponse.followUpQuestions,

    reviewPromptVersion: 1,
  });
  return { review };
};


const getReviewById=async({versionId, userId})=>{
    const version=Version.findById(versionId)
    if(!version){
        throw new ApiError(404,"Version not found")
    }
    if(version.createdBy.toString() !== userId.toString()){
        throw new ApiError(403,"Unauthorised Access")
    }
    const review=AiReview.findById(version._id)
    if(!review){
        throw new ApiError(404, "Review not found, try to create one review")
    }
    return {review}
}

export {generateReview, getReviewById}
