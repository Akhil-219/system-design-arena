import {asyncHandler} from "../utils/asyncHandler.js"
import { createUpVoteDesign , deleteUpVoteDesign} from "../services/commDesignVote.service.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const createUpVoteDesignController = asyncHandler(async(req, res)=>{
    const {designId} =req.params
    await createUpVoteDesign({designId, userId:req.user._id})
    return res.status(201).json(new ApiResponse(201,{}, "Upvoted the design successfully"))
})

const deleteUpVoteDesignController= asyncHandler(async(req, res)=>{
    const {designId}=req.params
    await deleteUpVoteDesign({designId, userId:req.user._id})
    return res.status(200).json(new ApiResponse(200,{}, "Removed the upVote successfully"))
})

export {createUpVoteDesignController, deleteUpVoteDesignController}