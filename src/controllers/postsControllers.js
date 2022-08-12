import dayjs from "dayjs";
import urlMetadata from "url-metadata";
import { postRepository } from "../repositories/postRepository.js";

async function createPost(req, res) {
  const user = res.locals.user;
  const post = req.body;
  try {
    const today = dayjs();
    await postRepository.createPost(user.id, today, post);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).send([{ msg: 'Erro ao fazer a postagem', label: 'error' }]);
  }
}

async function getPosts(req, res) {
  try {
    const posts = await postRepository.getAllPosts();
    const metaPosts = await Promise.all(posts.map(async (post) => {
      const { url, image, description, title } = await urlMetadata(post.url)
      return { url, image, description, title, message: post.message, userPicture: post.userPicture, username: post.username };
    }));
    res.status(200).send(metaPosts);
  } catch (err) {
    console.log(err);
    res.status(500).send([{ msg: 'Erro o carregar os posts', label: 'error' }]);
  }
}

export { createPost, getPosts };