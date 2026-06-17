import mongoose, { Schema } from "mongoose";

const mentorMessageSchema= new Schema({
    conversationId:{
        type:Schema.Types.ObjectId,
        ref:"MentorConversation",
        required:true,
    },
    role:{
        type:String,
        enum:["USER","AI"],
        required:true
    },
    content:{
        type:String,
        required:true,
    }
},{timestamps:true})
mentorMessageSchema.index({
    conversationId: 1,
    createdAt: 1
});

export const MentorMessage=mongoose.model("MentorMessage",mentorMessageSchema)