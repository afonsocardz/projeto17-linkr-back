import { Router } from "express";
import postsRouters from "./postsRouters.js";
import authRouters from "./authRouters.js";
import hashtagRouters from "./hashtagsRouters.js"
import commentsRouters from "./commentsRouters.js"
import verifyExpiredTokens from "../middlewares/verifyExpiredTokens.js";
import repostsRouters from "./repostsRouters.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use("/posts", postsRouters);
router.use("/", authRouters);
router.use(hashtagRouters);
router.use(userRouter);
router.use("/comments",commentsRouters);
router.use(repostsRouters);

setInterval(verifyExpiredTokens, 60000);

export default router;
