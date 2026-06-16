import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiResponse} from "../utils/ApiResponse.js"
import { createCommentInCommunity, deleteComment, getCommentsOfDesign } from "../services/commDesignComment.service.js"

const createCommentInCommunityController = asyncHandler(async(req, res)=>{
    const {designId}= req.params
    const {comment}=req.body
    const {createdComment}= await createCommentInCommunity({designId, comment, userId:req.user._id})

    return res
    .status(201)
    .json(new ApiResponse(201, {createdComment}, "Comment added successfully"))
})

const getCommentsOfDesignController= asyncHandler(async(req, res)=>{
    const {designId}= req.params
    const {comments}=await getCommentsOfDesign({designId})
    return res.status(200).json(new ApiResponse(200, {comments}, "Comments fetched successfully"))
})


const deleteCommentController=asyncHandler(async(req, res)=>{
    const {commentId}=req.params
    await deleteComment({commentId, userId:req.user._id})
    return res.status(200).json(new ApiResponse(200,{}, "Comment deleted successfully"))
})

export{createCommentInCommunityController, deleteCommentController, getCommentsOfDesignController}