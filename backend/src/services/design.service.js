import { Design } from "../models/design.model.js";
import { Version } from "../models/versions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Problem } from "../models/problems.model.js";
import { createSnapshot } from "./version.service.js";
import { AiReview } from "../models/ai_reviews.model.js";
import { DesignComment } from "../models/design_comments.model.js";
import { DesignVote } from "../models/design_votes.model.js";

const getOrCreateDesign = async ({ problemId, userId }) => {  
  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  const existingDesign = await Design.findOne({
    ownerId: userId,
    problemId,
  })
    .populate("currentVersion")
    .populate("problemId");

  if (existingDesign) {
    return { design: existingDesign, created: false };
  }

  const createdDesign = await Design.create({
    title: "Untitled Design",
    ownerId: userId,
    draftDiagramData: {},
    draftNotes: "",
    problemId,
    currentVersion: null,
    postedVersion: null,
  });

  // re-fetch populated so the response shape matches the "existing" branch
  // (frontend needs problem.title/description/requirements/constraints either way)
  const design = await Design.findById(createdDesign._id).populate("problemId");

  return { design, created: true };
};


const getDesignById = async ({ designId, userId }) => {
  //check for designid, if not sound return 404,
  // check for the user of that desing id,
  // get the current version return it
  
  const design = await Design.findById(designId).populate("currentVersion");
  if (!design) {
    throw new ApiError(404, "Design not found");
  }
  const ownerId = design.ownerId;
  if (userId.toString() !== ownerId.toString()) {
    throw new ApiError(403, "Access denied");
  }
  return { design };
};

const getMyDesigns = async ({ userId }) => {
  // check if user is valid or not like does the user have the designs or not
  // if not return error
  const designs = await Design.find({ ownerId: userId })
    .populate("problemId")
    .sort({ updatedAt: -1 }); // gives the recent

  return { designs };
};

const updateDesign = async ({ designId, userId, diagramData, notes }) => {
  const design = await Design.findById(designId);

  if (!design) {
    throw new ApiError(404, "Design not exists");
  }
  if (design.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  const draftDiagramData = diagramData;
  const draftNotes = notes;
  design.draftDiagramData = draftDiagramData;
  design.draftNotes = draftNotes;
  await design.save();
  return { design };
};

const deleteDesign = async ({ designId, userId }) => {
  const design = await Design.findById(designId);
  if (!design) {
    throw new ApiError(404, "Design not exists");
  }
  if (design.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }
 
  const versionIds = await Version.find({ designId: design._id }, "_id");
  const commentIds = await DesignComment.find({ designId: design._id }, "_id");
 
  await AiReview.deleteMany({
    versionId: { $in: versionIds.map((v) => v._id) },
  });
 
  await DesignCommentVote.deleteMany({
    commentId: { $in: commentIds.map((c) => c._id) },
  });
 
  await Version.deleteMany({ designId: design._id });
  await DesignComment.deleteMany({ designId: design._id });
  await DesignVote.deleteMany({ designId: design._id });
 
  await Design.findByIdAndDelete(design._id);
  return true;
};

export {
  getDesignById,
  getMyDesigns,
  updateDesign,
  deleteDesign,
  getOrCreateDesign,
};
