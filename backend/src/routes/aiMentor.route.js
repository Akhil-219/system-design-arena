import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createConversationController, getConversationController, getMessagesController, sendMessageController } from "../controllers/aiMentor.controller.js"

const router =Router({
    mergeParams:true
})

router.route("/conversation").post(verifyJWT,createConversationController)
router.route("/conversation/:conversationId").get(verifyJWT, getConversationController)
router.route("/conversation/:conversationId/messages").post(verifyJWT,sendMessageController)
router.route("/conversation/:conversationId/messages").get(verifyJWT, getMessagesController)

export default router


