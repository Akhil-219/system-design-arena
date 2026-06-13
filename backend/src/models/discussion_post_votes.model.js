import mongoose, { Schema } from "mongoose";

const discussionPostVoteSchema=new Schema({
    postId:{
        type:Schema.Types.ObjectId,
        ref:"DiscussionPost",
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true})
discussionPostVoteSchema.index(
    { postId: 1, userId: 1 },
    { unique: true }
);

export const DiscussionPostVote=mongoose.model("DiscussionPostVote",discussionPostVoteSchema)