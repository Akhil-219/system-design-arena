import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getCommunityDesignByIdController, getCommunityDesignsController, publishDesignController } from "../controllers/communityDesign.controller.js";

const router = Router({
    mergeParams: true
});

router.route("/publish").post(verifyJWT, publishDesignController)
router.route("/designs").get(getCommunityDesignsController)
router.route("/designs/:designId").get(getCommunityDesignByIdController)

export default router

