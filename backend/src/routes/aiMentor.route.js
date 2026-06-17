import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createConversationController, getConversationController } from "../controllers/aiMentor.controller.js"

const router =Router({
    mergeParams:true
})

router.route("/conversation").post(verifyJWT,createConversationController)
router.route("/conversation/:conversationId").get(verifyJWT, getConversationController)

export default router


