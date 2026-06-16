import {Router} from "express"
import { createPostInDiscussionController, deleteDiscussionPostController, getAllDiscussionPostsController, getDiscussionPostByIdController } from "../controllers/discussionPost.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router=Router({
    mergeParams:true
})

router.route("/").post(verifyJWT,createPostInDiscussionController)
router.route("/").get(getAllDiscussionPostsController)
router.route("/:postId").get(getDiscussionPostByIdController)
router.route("/:postId").delete(verifyJWT,deleteDiscussionPostController)

export default router