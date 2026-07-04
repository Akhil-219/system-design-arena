import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { publishDesignController } from "../controllers/communityDesign.controller.js";

const router = Router({
  mergeParams: true,
});

router.route("/publish").post(verifyJWT, publishDesignController);

export default router;