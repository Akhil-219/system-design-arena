import { Router } from "express";
import { getProblemBySlugController, getProblemsController } from "../controllers/problem.controller.js";
import communityDesignRouter from "../routes/communityDesign.routes.js"
const router = Router();

router.route("/").get(getProblemsController);
router.route("/:slug").get(getProblemBySlugController)

router.use("/:problemId/community", communityDesignRouter)
export default router