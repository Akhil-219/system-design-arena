import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getCommunityDesignByIdController, getCommunityDesignsController, publishDesignController } from "../controllers/communityDesign.controller.js";
import commDesignCommentRouter from "../routes/commDesignComment.routes.js"
const router = Router({
    mergeParams: true
});

router.route("/publish").post(verifyJWT, publishDesignController)
router.route("/designs").get(getCommunityDesignsController)
router.route("/designs/:designId").get(getCommunityDesignByIdController)

router.use("/designs/:designId", commDesignCommentRouter)

export default router

