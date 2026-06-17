import { getDashboard } from "../services/dashboard.service"
import {ApiResponse} from "../utils/ApiResponse"

const getDashboardController = asyncHandler(async(req,res)=>{
    const {designCount,publishedDesignCount,totalUpvotes,totalCommentupVotes,totalMentorConversationsCount,recentDesigns,recentDiscussion} =await getDashboard({userId:user._id})
    return res.status(200).json(new ApiResponse(200, {}, "fecthed dashboard"))
})

export {getDashboardController}