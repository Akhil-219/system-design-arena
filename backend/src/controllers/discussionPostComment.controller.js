import { createPostComment, deletePostComment, getCommentsOfPost } from "../services/discussionPostComment.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPostCommentController=asyncHandler(async(req,res)=>{
    const {postId}=req.params
    const {comment}=req.body
    const {createdComment}=await createPostComment({postId,comment,userId:req.user._id})
    return res.status(201).json(new ApiResponse(201,{createdComment},"Comment created successfully"))
})

const getCommentsOfPostController=asyncHandler(async(req, res)=>{
    const {postId}=req.params
    const {comments}=await getCommentsOfPost({postId})
    return res.status(200).json(new ApiResponse(200,{comments},"Comments fetched successfully"))
})

const deletePostCommentController=asyncHandler(async(req,res)=>{
    const {commentId,postId}=req.params
    await deletePostComment({commentId,postId,userId:req.user._id})
    return res.status(200).json(new ApiResponse(200,{},"Comment deleted successfully"))
})

export {createPostCommentController, getCommentsOfPostController, deletePostCommentController}