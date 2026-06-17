import { MentorConversation } from "../models/mentor_conversations.model.js"
import { MentorMessage } from "../models/mentor_messages.model.js"
import { buildMentorMessagePrompt } from "../utils/aiMentorPrompt.js"
import { openRouterClient } from "../ai/openRouter.js"
import {Problem} from "../models/problems.model.js"
import {ApiError} from "../utils/ApiError.js"

import { generateMentorResponse } from "../utils/aiMentorMessageGenerator.js"

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

const sendMessage = async ({conversationId,content,userId}) => {
    const conversation =await MentorConversation.findById(conversationId);
    if(!conversation){
        throw new ApiError(404, "Conversation not found"); 
    }
    if(conversation.userId.toString() !== userId.toString()){
        throw new ApiError(403, " Cant access another mentor messages")
    }
    if(!content?.trim()){
        throw new ApiError(400, "Message cant be empty")
    }
        
    const userMessage =await MentorMessage.create({
            conversationId,
            role:"USER",
            content:content
        });

    const history = await MentorMessage.find({conversationId}).sort({createdAt:1}).limit(20);
    history.reverse()
    const messages = history.map(message => ({
    role:
        message.role === "USER"
            ? "user"
            : "assistant",
        content: message.content
    }));
    const problem =await Problem.findById(conversation.problemId);
    if(!problem){
        throw new ApiError(404,"Problem not found")
    }
    const systemPrompt=buildMentorMessagePrompt({problem})
    messages.unshift({
        role:"system",
        content: systemPrompt
    });
    const aiReply= await generateMentorResponse(messages);
    const aiMessage =await MentorMessage.create({
        conversationId,
        role:"AI",
        content: aiReply
    });
    return {userMessage,aiMessage};
};
const getMessages = async({conversationId, userId})=>{
    const conversation =await MentorConversation.findById(conversationId);
    if(!conversation){
        throw new ApiError(404, "Conversation not found"); 
    }
    if(conversation.userId.toString() !== userId.toString()){
        throw new ApiError(403, " Cant access another mentor messages")
    }
    const messages=await MentorMessage.find({conversationId:conversationId}).sort({createdAt:1})
    return {messages}
}

export {createConversation, getConversation, sendMessage,getMessages}