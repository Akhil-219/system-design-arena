import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createSnapshotController, getAllVersionsController, getVersionByIdController } from "../controllers/version.controller.js";


const router = Router({
    mergeParams: true
});
router.route("/snapshot").post(verifyJWT,createSnapshotController)
router.route("/").get(verifyJWT,getAllVersionsController)
router.route("/:versionId").get(verifyJWT,getVersionByIdController)

export default router