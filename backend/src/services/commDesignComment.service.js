import { Design } from "../models/design.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { DesignComment } from "../models/design_comments.model.js";
const createCommentInCommunity = async ({ designId, comment, userId }) => {
  const design = await Design.findById(designId);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!design) {
    throw new ApiError(404, "Design not found");
  }
  if (!design.isPosted) {
    throw new ApiError(400, "Cannot comment on unpublished design");
  }
  const createdComment = await DesignComment.create({
    designId: designId,
    authorId: userId,
    content: comment,
  });
  const prevCount=desgin.commentCount
  designId.commentCount=prevCount+1;
  await design.save({validateBeforeSave:false})
  return { createdComment };
};

const getCommentsOfDesign =async({designId})=>{
    const design= await Design.findById(designId)
    if(!design){
        throw new ApiError(404, "Design not found")
    }
    if(!design.isPosted){
        throw new ApiError(400,"Cant access the comments of unpublished design")
    }
    const comments= await DesignComment.find({designId:design._id}).populate("authorId","username profilePicture reputation")
    return {comments}
}

const deleteComment= async({commentId,userId})=>{
    const comment= await DesignComment.findById(commentId)
    
    if(!comment){
        throw new ApiError(404,"Comment was already deleted")
    }
    if(comment.authorId.toString() !== userId.toString()){
        throw new ApiError(403,"Cant delete another person's comment")
    }
    const design =await Design.findById(comment.designId)
    const prevCount=design.commentCount;
    design.commentCount=prevCount-1;
    await DesignComment.delete({_id:commentId})
    return true
}

export { createCommentInCommunity , deleteComment, getCommentsOfDesign};
