import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  refreshAccessTokenController,
  registerUserController,
  getCurrentUserController
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/register").post(registerUserController);
router.route("/login").post(loginUserController);
router.route("/refresh-token").post(refreshAccessTokenController);
router.route("/logout").post(verifyJWT, logoutUserController);
router.route("/current-user").get(verifyJWT, getCurrentUserController)
export default router;
