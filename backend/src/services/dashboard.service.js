import { AiReview } from "../models/ai_reviews.model.js"
import {Design} from "../models/design.model.js"
import { DesignComment } from "../models/design_comments.model.js"
import { MentorConversation } from "../models/mentor_conversations.model.js"
import { DiscussionPost } from "../models/discussion_posts.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
const getDashboard=async({userId})=>{
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const designCount =await Design.countDocuments({ownerId:userId})
    const publishedDesignCount =await Design.countDocuments({ownerId:userId, isPosted:true})

    let aggregateResult= await Design.aggregate([
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

  aggregateResult=await DesignComment.aggregate([
    {
        $match:{
            authorId:user._id,
        },
    },
    {
        $group:{
            _id:null,
            total:{
                $sum:"$upvoteCount"
            },
        },
    },
  ])
  const totalCommentupVotes=aggregateResult[0]?.total || 0;

  const totalMentorConversationsCount= await MentorConversation.countDocuments({userId:user._id})
  const recentDesigns= await Design.find({ownerId:user._id}).sort({createdAt:-1}).limit(20)
  const recentDiscussion = await DiscussionPost.find({authorId:user._id}).sort({createdAt:-1}).limit(20)

  return {designCount,publishedDesignCount,totalUpvotes,totalCommentupVotes,totalMentorConversationsCount,recentDesigns,recentDiscussion}
}

export{getDashboard}