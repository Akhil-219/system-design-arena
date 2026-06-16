import { Design } from "../models/design.model.js";
import { DesignVote } from "../models/design_votes.model.js";
import { ApiError } from "../utils/ApiError.js";
const createUpVoteDesign = async ({ designId, userId }) => {
  const design = await Design.findById(designId);
  if (!design) {
    throw new ApiError(404, "Design not found");
  }
  if (!design.isPosted) {
    throw new ApiError(400, "Cant like the unposted design");
  }
  const existingVote = await DesignVote.findOne({
    designId,
    userId,
  });

  if (existingVote) {
    throw new ApiError(400, "You have already upvoted this design");
  }
    await DesignVote.create({
    designId: designId,
    userId: userId,
  });
  await Design.findByIdAndUpdate(designId, { $inc: { upvoteCount: 1 } });
  return true;
};

const deleteUpVoteDesign = async ({ designId, userId }) => {
  const design = await Design.findById(designId);
  if (!design) {
    throw new ApiError(404, "Design not found");
  }
  if (!design.isPosted) {
    throw new ApiError(404, "Cant unlike the unposted design");
  }
  const prevVoted = await DesignVote.findOne({
    designId: designId,
    userId: userId,
  });

  if (!prevVoted) {
    throw new ApiError(400, "Cant unlike the design");
  }
  await DesignVote.findOneAndDelete({ designId: designId, userId: userId });
  if (design.upvoteCount > 0) {
    await Design.findByIdAndUpdate(designId, { $inc: { upvoteCount: -1 } });
  }

  return true;
};

export { createUpVoteDesign, deleteUpVoteDesign };
