import { generateReview, getReviewById } from "../services/aiReview.service"
import { ApiResponse } from "../utils/ApiResponse"
import {asyncHandler} from "../utils/asyncHandler"
const generateReviewController=asyncHandler(async(req,res)=>{
    const versionId= req.params
    const review= await generateReview({versionId, userId:req.user._id})
    return res
    .status(201)
    .json(new ApiResponse(201, {review},"Review generated successfully"))
})

const getReviewByIdController=asyncHandler(async(req, res)=>{
    const versionId=req.params
    const review=await getReviewById({versionId,userId:req.user._id})
    return res
    .status(201)
    .json(new ApiResponse(201, {review},"Review generated successfully"))
})

export{generateReviewController, getReviewByIdController}