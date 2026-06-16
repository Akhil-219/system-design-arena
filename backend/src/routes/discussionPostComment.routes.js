import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createPostCommentController, deletePostCommentController, getCommentsOfPostController } from "../controllers/discussionPostComment.controller.js";



const router = Router({
    mergeParams: true
});


router.route("/comments").post(verifyJWT,createPostCommentController)
router.route("/comments").get(getCommentsOfPostController)
router.route("/comments/:commentId").delete(verifyJWT, deletePostCommentController)

export default router