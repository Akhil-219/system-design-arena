import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  refreshAccessTokenController,
  registerUserController,
  getCurrentUserController,
  googleAuthController
} from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/register").post(authLimiter,registerUserController);
router.route("/login").post(authLimiter,loginUserController);
router.route("/google").post(authLimiter,googleAuthController);
router.route("/refresh-token").post(refreshAccessTokenController);
router.route("/logout").post(verifyJWT, logoutUserController);
router.route("/current-user").get(verifyJWT, getCurrentUserController)
export default router;
