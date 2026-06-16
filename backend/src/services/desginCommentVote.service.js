import { DesignCommentVote } from "../models/design_comment_votes.model.js"
import { DesignComment } from "../models/design_comments.model.js"
import { ApiError } from "../utils/ApiError.js"

const createCommentUpVote=async({commentId,designId, userId})=>{
    const comment= await DesignComment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    if (comment.designId.toString() !== designId.toString()) {
        throw new ApiError(404, "Comment not found");
    }
    const existingUpVote= await DesignCommentVote.findOne({commentId:commentId,userId:userId})
    if(existingUpVote){
        throw new ApiError(409, "cant upvote the comment again")
    }
    await DesignCommentVote.create({
        commentId,
        userId
    })    
    await DesignComment.findByIdAndUpdate(commentId, { $inc: { upvoteCount: 1 } });
    return true
}

const deleteCommentUpVote=async({commentId,designId,userId})=>{
    const comment= await DesignComment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    if (comment.designId.toString() !== designId.toString()) {
        throw new ApiError(404, "Comment not found");
    }
    const existingUpVote= await DesignCommentVote.findOne({commentId:commentId,userId:userId})
    if(!existingUpVote){
        throw new ApiError(404, "cant downvote the comment again")
    }
    await DesignCommentVote.findOneAndDelete({commentId,userId})
    await DesignComment.findByIdAndUpdate(commentId, { $inc: { upvoteCount: -1 } })
    return true
}

export {createCommentUpVote, deleteCommentUpVote}