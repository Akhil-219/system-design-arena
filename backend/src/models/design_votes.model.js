import mongoose, { Schema } from "mongoose";

const designVoteSchema= new Schema({
    designId:{
        type:Schema.Types.ObjectId,
        ref:"Design",
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true})

designVoteSchema.index(
    { designId: 1, userId: 1 },
    { unique: true }
);

export const DesignVote=mongoose.model("DesignVote",designVoteSchema)