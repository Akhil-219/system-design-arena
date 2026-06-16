import { Design } from "../models/design.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
const getUserProfileByUsername = async ({ username }) => {
  const user = await User.findOne({ username: username }).select("-email -refreshToken -password -isVerified");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const publishedDesignsCount =
 await Design.countDocuments({
   ownerId:user._id,
   isPosted:true
 })
  const aggregateResult= await Design.aggregate([
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
  const totalUpvotes=aggregateResult[0]?.total || 0;
  return {user,publishedDesignsCount, totalUpvotes}
};

const getPublishedDesignsByUser = async({username})=>{
      const user = await User.findOne({ username: username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const publishedDesigns =await Design.find({ isPosted: true, ownerId: user._id }).populate("problemId")
.populate("postedVersion")
  return {publishedDesigns}
}

const getUser=async({userId})=>{
    const user= await User.findById(userId).select("-password -refreshToken -isVerified")
    if(!user){
        throw new ApiError(404, "User not found")
    }
  const publishedDesignsCount =
 await Design.countDocuments({
   ownerId:user._id,
   isPosted:true
 })
  const aggregateResult= await Design.aggregate([
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
  const totalUpvotes=aggregateResult[0]?.total || 0;
  return {user, totalUpvotes, publishedDesignsCount }
}

const updateProfile=async({userId, updatedbio})=>{
    const user =await User.findOneAndReplace({_id:userId},{bio:updatedbio}, {new:true})
    if(!user){
      throw new ApiError(404,"User not found")
    }
    return {user}
}

const updateAvatar = async({userId, profilePictureURL })=>{
  const profilePicture = await uploadCloudinary(profilePictureURL);
  if (!profilePicture?.url) {
    throw new ApiError(500, "Internal uploading issue");
  }
  await User.findByIdAndReplace(
    userId,
    {
      $set: {
        profilePicture: profilePicture.url,
      },
    },
    { new: true },
  ).select("-password");
  return true;
}

export {getUserProfileByUsername, getUser, updateProfile, updateAvatar,getPublishedDesignsByUser}
