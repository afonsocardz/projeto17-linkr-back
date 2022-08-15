import { postRepository } from "../repositories/postRepository.js";

async function createPost(req, res) {
  const user = res.locals.user;
  const post = res.locals.post;
  const hasHttp = /http|https/;
  if (post.image === "") {
    post.image =
      "https://cdn.pixabay.com/photo/2022/01/11/21/48/link-6931554__340.png";
  }
  if (!hasHttp.test(post.image)) {
    post.image = `https://${post.source}/${post.image}`;
  }

  try {
    await postRepository.createPost(user.id, post);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).send([{ msg: "Erro ao fazer a postagem", label: "error" }]);
  }
}

async function getPosts(req, res) {
  const { id } = req.query;
  try {
    const posts = await postRepository.getAllPosts(id);
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send([{ msg: "Erro o carregar os posts", label: "error" }]);
  }
}

async function likePost(req, res) {
  const { id: postId } = req.params;
  const user = res.locals.user;
  try {
    await postRepository.likeByPostId(postId, user.id);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function getUserPosts(req, res) {
  const { id: searchedUserId } = req.params;
  const { id } = req.query;
  try {
    const posts = await postRepository.getPostsById(id, searchedUserId);
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send([{ msg: "Erro o carregar os posts", label: "error" }]);
  }
}

export { createPost, getPosts, likePost, getUserPosts };
