import { Router } from "express";

import {
  followUnfollow,
  getFolloweds,
  getUser,
  searchUser,
} from "../controllers/userController.js";
import validateToken from "../middlewares/validateToken.js";

const userRouter = Router();

userRouter.get("/user/:userId", getUser);

userRouter.get("/userSearch/:username", validateToken, searchUser);

userRouter.get("/user/followeds/:userId", validateToken, getFolloweds);

userRouter.post("/user/follow-unfollow", validateToken, followUnfollow);

export default userRouter;
