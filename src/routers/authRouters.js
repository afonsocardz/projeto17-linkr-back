import { Router } from "express";
import { signIn } from "../controllers/authControllers.js";
import { signUpUsers } from "../controllers/signUpController.js";
import validateSchema from "../middlewares/validateSchema.js";
import signInSchema from "../schemas/signInSchema.js";
import signUpSchema from "../schemas/signUpSchema.js";

const router = Router();

router.post("/signin", validateSchema(signInSchema), signIn);
router.post("/sign-up", validateSchema(signUpSchema), signUpUsers);

export default router;
