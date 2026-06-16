import { createUpVotePost, deleteUpVotePost } from "../services/discussionPostUpVote.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createUpVotePostController= asyncHandler(async(req,res)=>{
    const {postId}=req.params
    await createUpVotePost({postId, userId:req.user._id})
    return res.status(200).json(200, {},"Upvoted successfully")
})

const deleteUpVotePostController=asyncHandler(async(req,res)=>{
    const{postId}=req.params
    await deleteUpVotePost({postId, userId:req.user._id})
    return res.status(200).json(200,{},"removed the upvote successfully")
})

export {deleteUpVotePostController, createUpVotePostController}