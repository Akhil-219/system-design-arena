import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createUpVotePostController, deleteUpVotePostController } from "../controllers/discussionPostUpVote.controller.js";

const router=Router({mergeParams:true})

router.route("/").post(verifyJWT,createUpVotePostController)
router.route("/").delete(verifyJWT,deleteUpVotePostController)

export default router