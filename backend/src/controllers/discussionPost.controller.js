import { createPostInDiscussion, deleteDiscussionPost, getAllDiscussionPosts, getDiscussionPostById } from "../services/discussionPost.service.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
const createPostInDiscussionController=asyncHandler(async(req,res)=>{
    const {content}=req.body
    const {problemId}=req.params
    const {post}=await createPostInDiscussion({problemId,content,userId:req.user._id})
    return res.status(201).json(new ApiResponse(201,{post}, "Post posted successfully"))
})

const getAllDiscussionPostsController=asyncHandler(async(req,res)=>{
    const {problemId}=req.params
    const {allPosts} = await getAllDiscussionPosts({problemId})
    return res.status(200).json(new ApiResponse(200,{allPosts},"Posts fetched successfully"))
})

const getDiscussionPostByIdController=asyncHandler(async(req, res)=>{
    const {postId}=req.params
    const {post}= await getDiscussionPostById({postId})
    return res.status(200).json(new ApiResponse(200,{post},"Post fetched successfully"))
})

const deleteDiscussionPostController=asyncHandler(async(req, res)=>{
    const {postId}=req.params
    await deleteDiscussionPost({postId,userId:req.user._id})
    return res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"))
})

export {getAllDiscussionPostsController,getDiscussionPostByIdController,deleteDiscussionPostController,createPostInDiscussionController}