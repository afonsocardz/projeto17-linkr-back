import { Router } from "express";
import postsRouters from "./postsRouters.js";
import authRouters from "./authRouters.js";
import hashtagRouters from "./hashtagsRouters.js"
import verifyExpiredTokens from "../middlewares/verifyExpiredTokens.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use("/posts", postsRouters);
router.use("/", authRouters);
router.use(hashtagRouters);
//router.use("/session", authRouters);
router.use(userRouter);

setInterval(verifyExpiredTokens, 60000);

export default router;
