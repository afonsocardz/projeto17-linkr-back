import { Router } from 'express';

import { getUser } from '../controllers/userController.js';
import validateToken from '../middlewares/validateToken.js';

const userRouter = Router();

userRouter.get('/user/:userId', getUser);

export default userRouter; 
