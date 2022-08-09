import dayjs from "dayjs";
import { postRepository } from "../repositories/postRepository.js";

async function createPost(req, res) {
  const userId = res.locals.userId;
  const post = req.body;
  try {
    const today = dayjs();
    await postRepository.createPost(userId, today, post);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).send([{ msg: 'Erro ao fazer a postagem', label: 'error' }]);
  }
}

async function getPosts(req, res) {
  try {
    const posts = await postRepository.getAllPosts();
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send([{msg: 'Erro o carregar os posts', label: 'error'}]);
  }
}

export { createPost, getPosts };