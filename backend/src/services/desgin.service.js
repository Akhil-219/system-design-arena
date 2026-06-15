import { Design } from "../models/design.model.js";
import { Version } from "../models/versions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Problem } from "../models/problems.model.js";

const createDesign = async ({ problemId, userId }) => {
  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }
  const existingDesgin = await Design.findOne({
    ownerId: userId,
    problemId,
  });
  if (existingDesgin) {
    throw new ApiError(409, "Design already exists");
  }
  const design = await Design.create({
    title: "Untitled Design",
    ownerId: userId,
    problemId,

    currentVersion: null,
  });
  const version = await Version.create({
    designId: design._id,
    versionNumber: 1,

    diagramData: {
      nodes: [],
      edges: [],
    },

    notes: "",
  });
  design.currentVersion = version._id;
  await design.save();
  return { design };
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
  const updateFields = {};

  if (diagramData !== undefined) {
    updateFields.diagramData = diagramData;
  }

  if (notes !== undefined) {
    updateFields.notes = notes;
  }
  const version = await Version.findByIdAndUpdate(
    design.currentVersion,
    updateFields,

    {
      new: true,
    },
  );

  return { design, version };
};

const deleteDesign = async ({ designId, userId }) => {
  const design = await Design.findById(designId);
  if (!design) {
    throw new ApiError(404, "Design not exists");
  }
  if (design.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }
  await Version.deleteMany({ designId: design._id });
  await Design.findByIdAndDelete(designId);
  return true;
};

export {createDesign, getDesignById, getMyDesigns,updateDesign, deleteDesign}