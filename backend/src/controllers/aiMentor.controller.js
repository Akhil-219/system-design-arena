import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { createConversation, getConversation } from "../services/aiMentor.service.js"

const createConversationController=asyncHandler(async(req,res)=>{
    const {problemId} =req.params
    const {conversation} = await createConversation({problemId, userId:req.user._id})
    return res.status(201).json(new ApiResponse(201,{conversation}, "Conversation created successfully"))
})

const getConversationController= asyncHandler(async(req,res)=>{
    const {conversationId}=req.params
    const {conversation}=await getConversation({conversationId, userId:req.user._id})
    return res.status(200).json(new ApiResponse(200, {conversation},"Conversation fetched successfully"))
})

export {createConversationController, getConversationController}