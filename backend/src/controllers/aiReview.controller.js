import { generateReview, getReviewById } from "../services/aiReview.service.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
const generateReviewController=asyncHandler(async(req,res)=>{
    const {versionId}= req.params
    const review= await generateReview({versionId, userId:req.user._id})
    return res
    .status(201)
    .json(new ApiResponse(201, {review},"Review generated successfully"))
})

const getReviewByIdController=asyncHandler(async(req, res)=>{
    const {versionId}=req.params
    const review=await getReviewById({versionId,userId:req.user._id})
    return res
    .status(201)
    .json(new ApiResponse(201, {review},"Review generated successfully"))
})

export{generateReviewController, getReviewByIdController}