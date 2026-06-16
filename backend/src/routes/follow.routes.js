import {Router} from "express"
import {verifyJWT} from "../middleware/auth.middleware.js"

import { followUserController, getFollowersController, getFollowingController, getFollowStatusController, unfollowUserController } from "../controllers/follow.controller.js"

const router=Router({
    mergeParams:true
})

router.route("/follow").post(verifyJWT, followUserController)
router.route("/follow").delete(verifyJWT,unfollowUserController)
router.route("/followers").get(getFollowersController)
router.route("/following").get(getFollowingController)
router.route("/follow-status").get(verifyJWT, getFollowStatusController)

export default router