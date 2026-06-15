import { Router } from "express";
import { generateReviewController, getReviewByIdController } from "../controllers/aiReview.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router({
    mergeParams: true
});
router.route("/review").post(verifyJWT,generateReviewController)
router.route("/review").get(verifyJWT,getReviewByIdController)

export default router