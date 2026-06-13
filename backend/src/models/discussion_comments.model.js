import mongoose, { Schema } from "mongoose";

const discussionCommentSchema=new Schema({
    postId:{
        type:Schema.Types.ObjectId,
        ref:"DiscussionPost",
        required:true,
    },
    authorId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true,
    },
    upvoteCount:{
        type:Number,
        default:0,
    },
},{timestamps:true})

export const DiscussionComment=mongoose.model("DiscussionComment",discussionCommentSchema)