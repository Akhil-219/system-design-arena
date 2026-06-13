import mongoose, { mongo, Schema } from "mongoose";

const designCommentSchema= new Schema({
    designId:{
        type:Schema.Types.ObjectId,
        ref:"Design",
        required:true
    },
    content:{
        type:String,
        required:true,
    },
    upvoteCount:{
        type: Number,
        default:0,
    },
    authorId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const DesignComment= mongoose.model("DesignComment",designCommentSchema)