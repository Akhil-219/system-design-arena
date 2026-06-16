import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"
import { getPublishedDesignsByUserController, getUserController, getUserProfileByUsernameController, updateAvatarController, updateProfileController } from "../controllers/user.controller.js";
import followRouter from "../routes/follow.routes.js"
const router= Router()

router.route("/me").get(verifyJWT,getUserController)
router.route("/profile").patch(verifyJWT,updateProfileController)
router.route("/profile-picture").patch(verifyJWT,upload.single("profilePictureURL"), updateAvatarController)
router.use("/:username", followRouter)
router.route("/:username/designs").get(getPublishedDesignsByUserController)
router.route("/:username").get(getUserProfileByUsernameController)



export default router