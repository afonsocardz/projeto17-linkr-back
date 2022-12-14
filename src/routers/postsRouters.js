import { Router } from "express";
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
  getUserPosts,
  likePost,
} from "../controllers/postsControllers.js";
import validateSchema from "../middlewares/validateSchema.js";
import validateToken from "../middlewares/validateToken.js";
import validateUrl from "../middlewares/validateUrl.js";
import Post from "../schemas/Post.js";

const router = Router();

router.get("/", getPosts);
router.post("/:id", validateToken, likePost);
router.put("/:id", validateToken, editPost);
router.delete("/:id", validateToken, deletePost);
router.post("/", validateToken, validateSchema(Post), validateUrl, createPost);
router.get("/:id", validateToken, getUserPosts);

export default router;
