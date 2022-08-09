import { Router } from 'express';
import postsRoutes from './postsRoutes.js';

const route = Router();

route.use('/posts', postsRoutes);

export default route;



