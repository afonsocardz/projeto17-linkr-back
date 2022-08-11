import { Router } from 'express';
import { createPost, getPosts } from '../controllers/postsControllers.js';
import validateSchema from '../middlewares/validateSchema.js';
import validateToken from '../middlewares/validateToken.js';
import Post from '../schemas/Post.js';

const router = Router();

router.get('/', getPosts);
router.post('/', validateToken, validateSchema(Post), createPost);

export default router;