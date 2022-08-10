import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.js"
import { signUpUsers } from "../controllers/signUpController.js";
import { signUpSchema } from "../schemas/signUpSchema.js";

const authRoutes = Router();

authRoutes.post("/sign-up", validateSchema(signUpSchema), signUpUsers);

export { authRoutes };
