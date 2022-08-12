import { Router } from "express";
import { getTrendingHashtags } from "../controllers/hashtagsController.js";

const router = Router();

router.get("/hashtag", getTrendingHashtags);

export default router;