import mongoose, { Schema } from "mongoose";

const discussionPostSchema = new Schema({
    problemId:{
        type:Schema.Types.ObjectId,
        ref:"Problem",
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
    commentCount: {
        type: Number,
        default: 0
    }
},{timestamps:true})

export const DiscussionPost= mongoose.model("DiscussionPost", discussionPostSchema)