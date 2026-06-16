import { createCommentUpVote, deleteCommentUpVote } from "../services/desginCommentVote.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCommentUpVoteController = asyncHandler(async(req,res)=>{
    const {commentId, designId}=req.params
    await createCommentUpVote({commentId,designId,userId:req.user._id})
    return res.status(201).json(new ApiResponse(201,{}, "comment upvoted successfully"))
})

const deleteCommentUpVoteController = asyncHandler(async(req,res)=>{
    const {commentId, designId}=req.params
    await deleteCommentUpVote({commentId,designId,userId:req.user._id})
    return res.status(200).json(new ApiResponse(200,{}, "Upvote on comment removed successfully"))
})

export {createCommentUpVoteController, deleteCommentUpVoteController}