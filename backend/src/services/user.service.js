import { Design } from "../models/design.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
const getUserProfileByUsername = async ({ username }) => {
  const user = await User.findOne({ username: username }).select("-email -refreshToken -password -isVerified");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const publishedDesigns =await getPublishedDesignsByUser({username})
  const publishedDesignsCount =(await publishedDesigns).length
  const totalUpvotes = await Design.aggregate([
    {
      $match: {
        ownerId: user._id,
        isPosted: true,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$upvoteCount",
        },
      },
    },
  ]);
  return {user,publishedDesignsCount, totalUpvotes}
};

const getPublishedDesignsByUser = async({username})=>{
      const user = await User.findOne({ username: username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const publishedDesigns =await Design.find({ isPosted: true, ownerId: user._id }).populate(problemId,
postedVersion);
  return {publishedDesigns}
}

const getUser=async({userId})=>{
    const user= await User.findById(userId).select("-email -password -refreshToken -isVerified")
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const publishedDesigns =await getPublishedDesignsByUser({username:user.username})
  const publishedDesignsCount =(await publishedDesigns).length
  const totalUpvotes = await Design.aggregate([
    {
      $match: {
        ownerId: user._id,
        isPosted: true,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$upvoteCount",
        },
      },
    },
  ]);
  return {user, publishedDesigns , publishedDesignsCount, totalUpvotes, }
}

const updateProfile=async({userId, updatedbio})=>{
    const user =await User.findById(userId)
    if(!user){
      throw new ApiError(404,"User not found")
    }
    await User.findOneAndUpdate({_id:userId},{bio:updatedbio}, {new:true})
    return true
}

const updateAvatar = async({userId, avatarURL })=>{
  const avatar = await uploadCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(500, "Internal uploading issue");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true },
  ).select("-password");
  return true;
}

export {getUserProfileByUsername, getUser, getPublishedDesignsByUser}
