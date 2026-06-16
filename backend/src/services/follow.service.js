import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import { Follow } from "../models/follow.model.js"
const followUser=async({username, currentUserId})=>{
    const followee = await User.findOne({username:username})

    if(!followee){
        throw new ApiError(404,"User not found with that username")
    }
    if(followee._id.toString() ===currentUserId.toString()){
        throw new ApiError(403, "Cannot follow yourself")
    }
    await Follow.create({
        followerId: currentUserId,
        followingId:followee._id
    })
    followee.followingCount+=1;
    await followee.save({validateBeforeSave:false})
    return true
}

const unfollowUser=async({username, currentUserId})=>{
    const followee = await User.findOne({username:username})
    if(!followee){
        throw new ApiError(404,"User not found with that username")
    }
    if(followee._id.toString() ===currentUserId.toString()){
        throw new ApiError(403, "Cannot follow yourself")
    }
    const followStatus= await Follow.findOneAndDelete({followerId:currentUserId, followingId:followee._id})
    followee.followersCount -=1;
    if(!followStatus){
        throw new ApiError(404, "Unable to unfollow the person  you are not following")
    }
    return true
}

const getFollowing=async({username})=>{
    const user= await User.findOne({username:username})
    if(!user){
        throw new ApiError(404, "User not found with that username")
    }
    const following =await Follow.find({followerId:user._id})
    return {following}
}

const getFollowers=async({username})=>{
    const user= await User.findOne({username:username})
    if(!user){
        throw new ApiError(404, "User not found with that username")
    }
    const followers =await Follow.find({followingId:user._id})
    return {followers}
}

const getFollowStatus=async({username, currentUserId})=>{
    const followee = await User.findOne({username:username})

    if(!followee){
        throw new ApiError(404,"User not found with that username")
    }
    if(followee._id.toString() ===currentUserId.toString()){
        throw new ApiError(403, "Cannot see the follow status yourself")
    }
    const followStatus=await Follow.findOne({followerId:currentUserId, followingId:followee._id})
    if(followStatus){
        return true
    }
    return false
}

export {getFollowStatus, getFollowers, getFollowing, followUser, unfollowUser}