import { Router } from "express";
import { generateReviewController, getReviewByIdController } from "../controllers/aiReview.controller";

const router = Router({
    mergeParams: true
});
router.route("/review").post(generateReviewController)
router.route("/review").get(getReviewByIdController)

export default router