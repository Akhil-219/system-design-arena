import { getDashboardController } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router=Router()

router.route("/").get(verifyJWT,getDashboardController)

export default router