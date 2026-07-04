import { createDesign, deleteDesign, getDesignById, getMyDesigns, updateDesign, getOrCreateDesign } from "../services/design.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"

const getOrCreateDesignController = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user._id;
  console.log("🚀 getOrCreateDesignController called with problemId:", problemId, "userId:", userId);
  const { design, created } = await getOrCreateDesign({ problemId, userId });
  return res
    .status(created ? 201 : 200)
    .json(
      new ApiResponse(
        created ? 201 : 200,
        { design },
        created ? "Design created successfully" : "Design fetched successfully"
      )
    );
});

const createDesignController= asyncHandler(async(req,res)=>{
    const {problemId,diagramData,notes}= req.body;
    const userId=req.user._id;
    const {design}= await createDesign({problemId, userId,diagramData,notes})
    return res
    .status(201)
    .json(new ApiResponse(201,{design}, "Design created successfully"))
})

const getDesignByIdController= asyncHandler(async(req,res)=>{
    const {designId}= req.params;
    const userId=req.user._id;
    const {design} =await getDesignById({designId, userId})

    return res.status(200).json(new ApiResponse(200, {design}, "Design fetch successfully"))
})

const getMyDesignsController =asyncHandler(async(req, res)=>{
    const userId=req.user._id
    const {designs}=await getMyDesigns({userId});
    return res.status(200).json(new ApiResponse(200, {designs},"Designs fetched successfully"))
})

const updateDesignController = asyncHandler(async(req, res)=>{
    const { designId } = req.params;
    const { diagramData, notes } = req.body;
    const userId=req.user._id
    const {design}= await updateDesign({designId, userId,diagramData,notes})
    return res.status(200).json(new ApiResponse(200, {design}, "Design updated successfully"))
})
const deleteDesignController =asyncHandler(async(req,res)=>{
    const {designId}= req.params
    const userId=req.user._id
    await deleteDesign({designId, userId})
    return res.status(200).json(new ApiResponse(200,{}, "Design deleted successfully"))
})

export {createDesignController, getDesignByIdController, getMyDesignsController, updateDesignController, deleteDesignController, getOrCreateDesignController}