import {Router} from "express"
import { createPostInDiscussionController, deleteDiscussionPostController, getAllDiscussionPostsController, getDiscussionPostByIdController } from "../controllers/discussionPost.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import postCommentsRouter from "../routes/discussionPostComment.routes.js"
import postUpVoteRouter from "../routes/discussionPostUpVote.routes.js"
const router=Router({
    mergeParams:true
})

router.route("/").post(verifyJWT,createPostInDiscussionController)
router.route("/").get(getAllDiscussionPostsController)
router.route("/:postId").get(getDiscussionPostByIdController)
router.route("/:postId").delete(verifyJWT,deleteDiscussionPostController)

router.use("/:postId",postCommentsRouter)
router.use("/:postId/upvote", postUpVoteRouter)

export default router