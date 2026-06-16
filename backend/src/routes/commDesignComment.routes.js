import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createCommentInCommunityController, deleteCommentController, getCommentsOfDesignController } from "../controllers/commDesignComment.controller.js";

const router = Router({
    mergeParams: true
});

router.route("/comments").post(verifyJWT,createCommentInCommunityController)
router.route("/comments").get(getCommentsOfDesignController)
router.route("/comments/:commentId").delete(verifyJWT,deleteCommentController)

export default router