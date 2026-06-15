import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createSnapshot, getAllVersions, getVersionById } from "../services/version.service.js";
const createSnapshotController = asyncHandler(async (req, res) => {
  const { designId } = req.params;

  const { version } = await createSnapshot({
    designId,
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { version }, "Snapshot created successfully"));
});

const getAllVersionsController =asyncHandler(async(req,res)=>{
  const { designId } = req.params;
  const {versions}=await getAllVersions({designId,
    userId:req.user._id
  })
  return res
  .status(200)
  .json(new ApiResponse(200,{versions}, "All versions fetched successfully"))
})

const getVersionByIdController=asyncHandler(async(req,res)=>{
  const {versionId}= req.params
  const {version}=await getVersionById({versionId, userId:req.user._id})

  return res.status(200).json(new ApiResponse(200, {version}, "Version fetched successfully"))
})

export{createSnapshotController, getAllVersionsController, getVersionByIdController}