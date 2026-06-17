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
mentorConversationSchema.index({
    userId: 1,
    problemId: 1
},
{
    unique: true
});

export const MentorConversation= mongoose.model("MentorConversation", mentorConversationSchema)