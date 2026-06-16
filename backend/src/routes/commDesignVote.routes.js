import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createUpVoteDesignController, deleteUpVoteDesignController } from "../controllers/commDesignVote.controller.js";


const router = Router({
    mergeParams: true
});

router.route("/").post(verifyJWT, createUpVoteDesignController)
router.route("/").delete(verifyJWT,deleteUpVoteDesignController)

export default router