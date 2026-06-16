import { ApiError } from "../utils/ApiError.js";
import { DiscussionComment } from "../models/discussion_comments.model.js";
import { DiscussionPost } from "../models/discussion_posts.model.js"

const createPostComment=async({postId, comment, userId})=>{
    const post=await DiscussionPost.findById(postId)
    if(!post){
        throw new ApiError(404, "Post not found")
    }
    if (!comment?.trim()) {
        throw new ApiError(400, "Comment cannot be empty");
    }
    const createdComment= await DiscussionComment.create({postId:postId, authorId:userId, content:comment})
    await DiscussionPost.findByIdAndUpdate(postId,{$inc:{commentCount:1}})
    return {createdComment}
}

const getCommentsOfPost=async({postId})=>{
    const post=await DiscussionPost.findById(postId)
    if(!post){
        throw new ApiError(404, "Post not found")
    }
    const comments= await DiscussionComment.find({postId:postId}).populate("authorId", "username profilePicture").sort({ createdAt: -1 });
    return {comments}
}

const deletePostComment=async({commentId,postId,userId})=>{
    const comment= await DiscussionComment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "comment not found or already deleted")
    }
    if(comment.postId.toString() !== postId.toString()){
    throw new ApiError(400,"Comment does not belong to this post")
    }
    if(comment.authorId.toString() !== userId.toString()){
        throw new ApiError(403 , "Cant delete others comment")
    }
    await DiscussionComment.findByIdAndDelete(commentId)
    await DiscussionPost.findByIdAndUpdate(postId,{$inc:{commentCount:-1}})
    return true
}


export {deletePostComment, getCommentsOfPost,createPostComment}