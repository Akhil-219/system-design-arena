import { getUser , getPublishedDesignsByUser, updateProfile, updateAvatar, getUserProfileByUsername} from "../services/user.service.js";
import {asyncHandler} from"../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js";

const getUserController= asyncHandler(async(req, res)=>{
    const {user, publishedDesignsCount, totalUpvotes }=await getUser({userId:req.user._id})

    return res.status(200).json(new ApiResponse(200, {user, totalUpvotes,  publishedDesignsCount }, " Profile fetched successfully"))
})

const getPublishedDesignsByUserController=asyncHandler(async(req,res)=>{
    const {username}=req.params
    const {publishedDesigns} =await getPublishedDesignsByUser({username:username})
    return res.status(200).json(new ApiResponse(200,{publishedDesigns}, "PublishedDesigns fetched successfully"))
})

const updateProfileController=asyncHandler(async(req, res)=>{
    const {updatedbio}=req.body
    console.log({updatedbio});
    
    const {user}=await updateProfile({userId:req.user._id, updatedbio:updatedbio})
    return res.status(200).json(new ApiResponse(200, {user}, "Bio updated successfully"))
})

const updateAvatarController=asyncHandler(async(req,res)=>{
    const profilePictureURL = req.file?.path;
    if (!profilePictureURL) {
        throw new ApiError(400, "there was no valid path  of the avatar");
    }
    await updateAvatar({profilePictureURL:profilePictureURL, userId:req.user._id})
    return res.status(200).json(new ApiResponse(200,{}, "Avatar updated successfully"))
})

const getUserProfileByUsernameController =asyncHandler(async(req, res)=>{
    const {username}= req.params
    const {user,publishedDesignsCount, totalUpvotes}= await getUserProfileByUsername({username:username})

    return res.status(200).json(new ApiResponse(200, {user,publishedDesignsCount, totalUpvotes}, "User fetched successfully"))
})

export {getPublishedDesignsByUserController, getUserController, updateAvatarController, updateProfileController, getUserProfileByUsernameController}