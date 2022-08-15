import { Router } from "express";

import { getUser, searchUser } from "../controllers/userController.js";
import validateToken from "../middlewares/validateToken.js";

const userRouter = Router();

userRouter.get("/user/:userId", getUser);

userRouter.get("/userSearch/:username", validateToken, searchUser);

export default userRouter;
