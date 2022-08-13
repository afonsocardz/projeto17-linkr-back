import { postRepository } from "../repositories/postRepository.js";

async function createPost(req, res) {
  const user = res.locals.user;
  const post = res.locals.post;
  const hasHttp = /http|https/;
  if (!hasHttp.test(post.image)){
    post.image = `https://${post.source}/${post.image}`;
  }
  if(!post.image){
    post.image = 'https://cdn.pixabay.com/photo/2022/01/11/21/48/link-6931554__340.png';
  }
  try {
    await postRepository.createPost(user.id, post);
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
    res.status(500).send([{ msg: 'Erro o carregar os posts', label: 'error' }]);
  }
}

export { createPost, getPosts };