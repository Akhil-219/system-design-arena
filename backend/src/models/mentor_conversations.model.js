import mongoose, { Schema } from "mongoose";

const mentorConversationSchema= new Schema({
    problemId:{
        type:Schema.Types.ObjectId,
        ref:"Problem",
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true})

export const MentorConversation= mongoose.model("MentorConversation", mentorConversationSchema)