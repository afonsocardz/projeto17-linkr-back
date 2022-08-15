import { Router } from "express";
import { getTrendingHashtags, redirectHashtag } from "../controllers/hashtagsController.js";

const router = Router();

router.get("/hashtag", getTrendingHashtags);
router.get("/hashtag/:hashtag", redirectHashtag)

export default router;