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

const updateProfile = async ({ userId, updatedbio }) => {
  // was: findOneAndReplace — which REPLACES the whole document with just
  // { bio }, wiping username/email/password/etc. findByIdAndUpdate does a
  // partial merge instead, touching only the field we actually want to change.
  const user = await User.findByIdAndUpdate(
    userId,
    { bio: updatedbio },
    { new: true }
  ).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return { user };
};
 
const updateAvatar = async ({ profilePictureURL, userId }) => {
  const profilePicture = await uploadCloudinary(profilePictureURL);
  if (!profilePicture?.url) {
    throw new ApiError(500, "Internal uploading issue");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { profilePicture: profilePicture.url } },
    { new: true }
  ).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return { user };
};

export {getUserProfileByUsername, getUser, updateProfile, updateAvatar,getPublishedDesignsByUser}
