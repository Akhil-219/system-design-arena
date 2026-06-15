import { Design } from "../models/design.model.js";
import { Version } from "../models/versions.model.js";
import { ApiError } from "../utils/ApiError.js";

const publishDesign = async ({ versionId, userId }) => {
  // get the version , and user , check the are valid or not ,
  // get the design of the version, if there set the ispublished to ture if nto there
  // else change the publishedVers
  const version = await Version.findById(versionId);
  if (!version) {
    throw new ApiError(404, "Version not found");
  }
  if (version.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorised Access");
  }
  const design = await Design.findById(version.designId);
  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  design.isPosted = true;
  design.status = "PUBLISHED";
  design.postedVersion = version._id;

  await design.save({ validateBeforeSave: false });
  return { version };
};

const getCommunityDesigns = async ({ problemId }) => {
  const query = {
    isPosted: true,
  };
  if (problemId) {
    query.problemId = problemId;
  }
  const designs = await Design.find(query)
    .populate("ownerId", "username profilePicture")
    .populate("problemId", "title difficulty");
  return { designs };
};

const getCommunityDesignById = async ({ problemId, designId }) => {
  const query = {
    isPosted: true,
    _id: designId,
  };
  if (problemId) {
    query.problemId = problemId;
  }
  const design = await Design.findOne(query)
    .populate("ownerId")
    .populate("problemId")
    .populate("postedVersion");
  if (!design) {
    throw new ApiError(404, "Design not found");
  }
  return { design };
};

export { publishDesign, getCommunityDesignById, getCommunityDesigns };
