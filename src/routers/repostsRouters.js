import { Router } from "express";
import { changeReposts, getReposts,  } from "../controllers/repostsControllers.js";
import validateToken from "../middlewares/validateToken.js";

const router = Router();

router.get("/reposts", validateToken, getReposts);
router.post("/reposts/:id", validateToken, changeReposts);

export default router;