import { commentRepository } from "../repositories/commentRepository.js";

async function createComment(req, res){
  const user = res.locals.user;
  const comment = req.body;
  try {
    console.log(comment);
    await commentRepository.insertComment(user.id, {...comment});
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error to comment this post');
  }
}

async function getCommentsByPostId(req, res){
  const user = res.locals.user;
  const {postId} = req.query;
  try {
    const comments = await commentRepository.selectCommentByPostId(postId);
    res.status(200).send(comments);
  } catch (err) {
    console.log(err);
    res.status(500).send('Erro ao carregar comentários');
  }
}

export {createComment, getCommentsByPostId};