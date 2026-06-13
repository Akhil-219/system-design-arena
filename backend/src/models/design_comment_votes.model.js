import mongoose, { Schema } from "mongoose";

const designCommentVoteSchema=new Schema({
    commentId:{
        type:Schema.Types.ObjectId,
        ref:"DesignComment",
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

designCommentVoteSchema.index(
    { commentId: 1, userId: 1 },
    { unique: true }
);

export const DesignComment_vote=mongoose.model("DesignCommentVote",designCommentVoteSchema)