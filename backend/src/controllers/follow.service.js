import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { followUser, getFollowers, getFollowing, unfollowUser } from "../services/follow.service.js"

const getFollowersController=asyncHandler(async(req, res)=>{
    const username= req.params
    const followers= await getFollowers({username})
    return res.status(200).json(new ApiResponse(200, {followers},"Followers fetched successfully"))
})

const getFollowingController=asyncHandler(async(req,res)=>{
    const username= req.params
    const following= await getFollowing({username})
    return res.status(200).json(new ApiResponse(200, {following},"Following fetched successfully"))
})

const followUserController=asyncHandler(async(req, res)=>{
    const username= req.params
    await followUser({username:username, currentUserId:req.user._id})
    return res.status(200).json(new ApiResponse(200, {}, `You followed ${username} successfully`))
})

const unfollowUserController=asyncHandler(async(req, res)=>{
    const username= req.params
    await unfollowUser({username:username, currentUserId:req.user._id})
    return res.status(200).json(new ApiResponse(200, {}, `You unfollowed ${username} successfully`))
})

export {unfollowUserController, followUserController, getFollowersController, getFollowingController}