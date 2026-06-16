import { DiscussionPost } from "../models/discussion_posts.model.js"
import {Problem} from "../models/problems.model.js"
import {ApiError} from "../utils/ApiError.js"
const createPostInDiscussion=async({problemId, content,userId})=>{
    const problem= await Problem.findById(problemId)
    if(!problem){
        throw new ApiError(404, "Problem not found")
    }
    if(!content?.trim()){
        throw new ApiError(400,"Content is required")
    }
    const post=await DiscussionPost.create({
        problemId:problemId,
        authorId:userId,
        content:content
    })
    return {post}
}

const getAllDiscussionPosts=async({problemId})=>{
    const problem= await Problem.findById(problemId)
    if(!problem){
        throw new ApiError(404, "Problem not found")
    }
    const allPosts=await DiscussionPost.find({problemId:problemId}).populate("authorId","username profilePicture").sort({ createdAt: -1 })
    return {allPosts}
}

const deleteDiscussionPost=async({postId,userId})=>{
    const existingPost=await DiscussionPost.findById(postId)
    if(!existingPost){
        throw new ApiError(404,"Post not found")
    }
    if(existingPost.authorId.toString() !== userId.toString()){
        throw new ApiError(403, "Cannot delete another user's post")
    }
    // delete many comments of the post , votes in future then
    await DiscussionPost.findByIdAndDelete(postId)
    return true
}

const getDiscussionPostById=async({postId})=>{
    const post=await DiscussionPost.findById(postId).populate("authorId","username profilePicture")
    if(!post){
      throw new ApiError(404,"Post not found")
    }
    return {post}
}

export {createPostInDiscussion, getAllDiscussionPosts, getDiscussionPostById, deleteDiscussionPost}