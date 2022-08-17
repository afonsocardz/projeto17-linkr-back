import { Router } from "express";
import { getTrendingHashtags, redirectHashtag } from "../controllers/hashtagsController.js";
import validateToken from "../middlewares/validateToken.js";

const router = Router();

router.get("/hashtag", validateToken, getTrendingHashtags);
router.get("/hashtag/:hashtag", validateToken, redirectHashtag);

export default router;