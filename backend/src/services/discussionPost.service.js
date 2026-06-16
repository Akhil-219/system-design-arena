import { DiscussionPost } from "../models/discussion_posts.model.js"
import {Problem} from "../models/problems.model.js"
import {ApiError} from "../utils/ApiError.js"
const createPostInDiscussion=async({problemId, content,userId})=>{
    const problem= await Problem.findById(problemId)
    if(!problem){
        throw new ApiError(404, "Problem not found")
    }
    await DiscussionPost.create({
        problemId:problemId,
        authorId:userId,
        content:content
    })
    return true
}

const getAllDiscussionPosts=async({problemId})=>{
    const problem= await Problem.findById(problemId)
    if(!problem){
        throw new ApiError(404, "Problem not found")
    }
    const allPosts=await DiscussionPost.find({problemId:problemId}).populate("authorId","username profilePicture").populate("content")
    return {allPosts}
}

const deleteDiscussionPost=async({postId,userId})=>{
    const problem= await Problem.findById(problemId)
    if(!problem){
        throw new ApiError(404, "Problem not found")
    }
    const existingPost=DiscussionPost.findById(postId)
    if(!existingPost){
        throw new ApiError(404,"Post not found")
    }
    if(existingPost.authorId.toString() !== userId.toString()){
        throw new ApiError(403, "Cant delete another person comment")
    }
    // delete many comments of the post , votes in future then
    await DiscussionPost.findByIdAndDelete(postId)
    return true
}

const getDiscussionPostById=async(postId)=>{
    const post=await DiscussionPost.findById(postId).populate("authorId","username profilePicture").populate("content")
    return {post}
}

export {createPostInDiscussion, getAllDiscussionPosts, getDiscussionPostById, deleteDiscussionPost}