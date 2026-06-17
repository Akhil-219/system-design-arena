import { Router } from "express";
import { getProblemBySlugController, getProblemsController } from "../controllers/problem.controller.js";
import communityDesignRouter from "../routes/communityDesign.routes.js"
import discussionRouter from "../routes/discussionPost.routes.js"
import aiMentorRouter from "../routes/aiMentor.route.js"
const router = Router();

router.route("/").get(getProblemsController);
router.route("/:slug").get(getProblemBySlugController)

router.use("/:problemId/community", communityDesignRouter)
router.use("/:problemId/discussion",discussionRouter)
router.use("/:problemId/mentor", aiMentorRouter)
export default router