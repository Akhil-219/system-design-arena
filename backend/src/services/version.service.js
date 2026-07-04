import { Version } from "../models/versions.model.js";
import { Design } from "../models/design.model.js";
import { ApiError } from "../utils/ApiError.js";


const createSnapshot = async ({ designId, userId }) => {
  console.log("designId:", designId);

  const design = await Design.findById(designId);
  if (!design) {
    throw new ApiError(404, "Design not found");
  }
  if (design.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorised Access");
  }
  let nextVersionNumber;
  const latestVersion = await Version.findOne({ designId }).sort({
    versionNumber: -1,
  });
  if (latestVersion === null) {
    nextVersionNumber = 1;
  } else {
    nextVersionNumber = latestVersion.versionNumber + 1;
  }
  if (
    latestVersion &&
    JSON.stringify(latestVersion.diagramData) ===
      JSON.stringify(design.draftDiagramData) &&
    latestVersion.notes === design.draftNotes
  ) {
    throw new ApiError(400, "No changes detected since last snapshot");// to avoid duplicate snapshots
  }
  const version = await Version.create({
    designId,
    problemId: design.problemId,
    versionNumber: nextVersionNumber,
    diagramData: design.draftDiagramData,
    notes: design.draftNotes,
    createdBy: userId,
  });
  design.currentVersion = version._id;
  await design.save({ validateBeforeSave: false });
  return { version };
};


const getAllVersions= async({designId, userId})=>{
    const design = await Design.findById(designId)
    if(!design){
        throw new ApiError(404,"Design not found")
    }
    if(design.ownerId.toString()!==userId.toString()){
        throw new ApiError(403, "Unauthorised Access")
    }
    const versions= await Version.find({designId:design._id})
    return {versions}
}

const getVersionById =async({versionId,userId})=>{
    const version= await Version.findById(versionId)
    if(!version){
        throw new ApiError(404, "Version not found")
    }
    if(version.createdBy.toString() !== userId.toString()){
        throw new ApiError(403, "Unauthorised Access")
    }
    return {version}
}

const deleteVersion = async ({ versionId, userId }) => {
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
 
  // Guard: don't let someone delete the version that's currently live on
  // the community page out from under it. They have to unpublish first.
  if (design.postedVersion?.toString() === version._id.toString()) {
    throw new ApiError(
      400,
      "This version is currently published. Unpublish it before deleting."
    );
  }
 
  await AiReview.deleteOne({ versionId: version._id });
  await Version.findByIdAndDelete(version._id);
 
  // If we just deleted the design's active version, fall back to the most
  // recent remaining one (or null if this was the last version left).
  if (design.currentVersion?.toString() === version._id.toString()) {
    const latestRemaining = await Version.findOne({ designId: design._id }).sort({
      versionNumber: -1,
    });
    design.currentVersion = latestRemaining ? latestRemaining._id : null;
    await design.save({ validateBeforeSave: false });
  }
 
  return true;
};

export { createSnapshot,getAllVersions,getVersionById , deleteVersion};
