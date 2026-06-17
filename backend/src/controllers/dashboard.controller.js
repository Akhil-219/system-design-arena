import { getDashboard } from "../services/dashboard.service.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
const getDashboardController = asyncHandler(async(req,res)=>{
    const dashboard=await getDashboard({userId:req.user._id})
    return res.status(200).json(new ApiResponse(200, dashboard, "Fecthed dashboard"))
})

export {getDashboardController}