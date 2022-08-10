import { Router } from "express";
import { signIn } from "../controllers/authControllers.js";
import validateSchema from "../middlewares/validateSchema.js";
import signInSchema from "../schemas/signInSchema.js";

const router = Router();

router.post("/signin", validateSchema(signInSchema), signIn);

export default router;
