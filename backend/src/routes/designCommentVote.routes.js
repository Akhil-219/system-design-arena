import {Router} from "express"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { createCommentUpVoteController, deleteCommentUpVoteController } from "../controllers/designCommentVote.controller.js"

const router=Router({
    mergeParams:true
})

router.route("/").post(verifyJWT,createCommentUpVoteController)
router.route("/").delete(verifyJWT,deleteCommentUpVoteController)

export default router