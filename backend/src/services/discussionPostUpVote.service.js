import { DiscussionPost } from "../models/discussion_posts.model.js";
import { DiscussionPostVote } from "../models/discussion_post_votes.model.js";
import { ApiError } from "../utils/ApiError.js";

const createUpVotePost=async({postId, userId})=>{
    const post=await DiscussionPost.findById(postId)
    if(!post){
        throw new ApiError(404, "Post not found")
    }
    const existingVote= await DiscussionPostVote.findOne({postId:post,userId:userId})
    if(existingVote){
        throw new ApiError(400, "You have already liked the post")
    }
    await DiscussionPostVote.create({postId:postId,userId:userId})
    await DiscussionPost.findByIdAndUpdate(postId,{$inc:{upvoteCount:1}})
    return true
}

const deleteUpVotePost=async({postId, userId})=>{
    const post=await DiscussionPost.findById(postId)
    if(!post){
        throw new ApiError(404, "Post not found")
    }
    const existingVote= await DiscussionPostVote.findOne({postId:postId,userId:userId})
    if(!existingVote){
        throw new ApiError(400, "Cant unlike the post again")
    }
    await DiscussionPostVote.findOneAndDelete({postId:post,userId:userId})
    await DiscussionPost.findByIdAndUpdate(postId,{$inc:{upvoteCount:-1}})
    return true;
}

export{createUpVotePost, deleteUpVotePost}