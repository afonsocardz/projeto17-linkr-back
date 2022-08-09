import { Router } from 'express';
import { createPost, getPosts } from '../controllers/postsControllers.js';
import validateSchema from '../middlewares/validateSchema.js';
import Post from '../schemas/Post.js';

const route = Router();

route.get('/', getPosts);
route.post('/', validateSchema(Post), createPost);

export default route;