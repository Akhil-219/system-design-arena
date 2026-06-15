import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createSnapshotController, getAllVersionsController, getVersionByIdController } from "../controllers/version.controller.js";
import aiReviewRouter from "../routes/aiReview.routes.js"
import communityDesignRouter from "../routes/communityDesign.routes.js"
const router = Router({
    mergeParams: true
});
router.route("/snapshot").post(verifyJWT,createSnapshotController)
router.route("/").get(verifyJWT,getAllVersionsController)
router.route("/:versionId").get(verifyJWT,getVersionByIdController)

router.use("/:versionId",aiReviewRouter)
router.use("/:versionId",communityDesignRouter)
export default router