import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createDesignController, deleteDesignController, getDesignByIdController, getMyDesignsController, updateDesignController } from "../controllers/design.controller.js";
import versionRouter from "../routes/version.routes.js"

const router = Router({
    mergeParams: true
});

router.route("/").post(verifyJWT,createDesignController)
router.route("/me").get(verifyJWT, getMyDesignsController)
router.route("/:designId").get(verifyJWT, getDesignByIdController)
router.route("/:designId").patch(verifyJWT,updateDesignController)
router.route("/:designId").delete(verifyJWT, deleteDesignController) 

router.use("/:designId/versions", versionRouter);

export default router