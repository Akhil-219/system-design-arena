import { Router } from "express";
import { getProblemBySlugController, getProblemsController } from "../controllers/problem.controller.js";

const router = Router();

router.route("/").get(getProblemsController);
router.route("/:slug").get(getProblemBySlugController)

export default router