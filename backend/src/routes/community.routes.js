import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getCommunityDesignsController,
  getCommunityDesignByIdController,
} from "../controllers/communityDesign.controller.js";
import commDesignCommentRouter from "../routes/commDesignComment.routes.js";
import commDesignVoteRouter from "../routes/commDesignVote.routes.js";

// New router for everything community-related that ISN'T publishing.
// mergeParams lets this pick up :problemId when mounted under a
// problem-scoped path, while still working standalone for the general
// community page in the navbar (where there's no problemId to merge).
const router = Router({
  mergeParams: true,
});

router.route("/").get(getCommunityDesignsController);
router.route("/:designId").get(getCommunityDesignByIdController);

router.use("/:designId", commDesignCommentRouter);
router.use("/:designId/upvote", commDesignVoteRouter);

export default router;

// === Mounting (in your main routes file, e.g. app.js or routes/index.js) ===
//
// import communityRouter from "./routes/community.routes.js";
//
// General community page (navbar) — browses across all problems:
//   app.use("/api/v1/community", communityRouter);
//
// Problem-scoped community tab (the "Community" tab in LeftPanel) —
// mergeParams means req.params.problemId flows down into
// getCommunityDesignsController automatically:
//   app.use("/api/v1/problems/:problemId/community", communityRouter);
//
// Both mounts share the exact same router/controllers/services — no
// duplicated logic, just two entry points into the same data.
