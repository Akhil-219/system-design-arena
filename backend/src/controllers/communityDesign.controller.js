import { getCommunityDesignById, getCommunityDesigns, publishDesign } from "../services/communityDesign.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCommunityDesignsController=asyncHandler(async(req,res)=>{
    const {problemId}=req.params
    const {designs}= await getCommunityDesigns({problemId})
    return res
    .status(200)
    .json(new ApiResponse(200, {designs},"CommunityDesigns fetched successfully"))
})

const getCommunityDesignByIdController=asyncHandler(async(req,res)=>{
    const {problemId,designId}=req.params
    const {design}= await getCommunityDesignById({problemId,designId})
    return res
    .status(200)
    .json(new ApiResponse(200, {design},"Community Design fetched successfully"))
})

const publishDesignController=asyncHandler(async(req,res)=>{
    const {versionId} = req.params
    const{version}= await publishDesign({versionId,userId:req.user._id})
    return res
    .status(201)
    .json(new ApiResponse(201, {version},"Design published successfully"))
})

export{getCommunityDesignByIdController,getCommunityDesignsController,publishDesignController}