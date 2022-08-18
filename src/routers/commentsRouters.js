import {Router} from 'express';
import { createComment, getCommentsByPostId } from '../controllers/commentsControllers.js';
import validateToken from '../middlewares/validateToken.js';

const router = Router();

router.post("/", validateToken, createComment)
router.get("/", validateToken, getCommentsByPostId)

export default router;