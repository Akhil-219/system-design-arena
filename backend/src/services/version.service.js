import { Version } from "../models/versions.model.js";
import { Design } from "../models/design.model.js";
import { ApiError } from "../utils/ApiError.js";

const createSnapshot = async ({
  problemId,designId,userId,draftDiagramData,draftNotes,}) => {
  const desgin = Design.findById(designId);
  if(!desgin){
    throw new ApiError(404,"Design not found")
  }
  if(desgin.ownerId.toString() !== userId){
    throw new ApiError(403,"Unauthorised Access")
  }
  const latestVersion = await Version
    .findOne({ designId })
    .sort({ versionNumber: -1 });
  if(latestVersion===null){
    nextVersionNumber=1;
  }
  else{
    nextVersionNumber=latestVersion.versionNumber+1
  }
  const version = await Version.create({
    designId,
    versionNumber: nextVersionNumber,
    diagramData: design.draftDiagramData,
    notes: design.draftNotes,
  });
  desgin.currentVersion=version._id
   await design.save({ validateBeforeSave: false });
   return {version}
};

export {createSnapshot}