import { MentorConversation } from "../models/mentor_conversations.model.js"
import {Problem} from "../models/problems.model.js"
import {ApiError} from "../utils/ApiError.js"

const createConversation=async({problemId, userId})=>{
    const problem = await Problem.findById(problemId)
    if(!problem){
        throw new ApiError(404, "Problem not found")
    }
    const existingConversation= await MentorConversation.findOne({problemId:problemId,userId:userId})
    if(existingConversation){
        return {conversation:existingConversation}
    }
    const conversation =await  MentorConversation.create({problemId: problemId , userId:userId})
    return {conversation}

}

const getConversation =async({conversationId, userId})=>{
    const conversation= await MentorConversation.findById(conversationId).populate("problemId","title difficulty");
    if(!conversation){
        throw new ApiError(404, "Conversation not found")
    }
    if(conversation.userId.toString() !== userId.toString()){
        throw new ApiError(403, "You cant access another mentors chat")
    }
    return {conversation}
}