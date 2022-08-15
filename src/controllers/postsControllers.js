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
    const { rows } = await postRepository.createPost(user.id, post);
    const postId =  rows[0].id;

    const postMessage = post.message;
    const filterPostMessage = postMessage.split(' ').filter((word) => word.startsWith('#'));

    if (filterPostMessage.length === 0) {
      return res.sendStatus(201);
    } else {
      const hashtag = filterPostMessage.toString();

      const { rows, rowCount: metHashtag } = await postRepository.searchForHashtag(hashtag);
  
      if (metHashtag === 1) {
        const hashtagId = rows[0].id;
        await postRepository.insertPostsHashtags(postId, hashtagId);
        res.sendStatus(201);
      }else{
        const { rows } = await postRepository.createHashtags(hashtag);
        const hashtagId = rows[0].id;
        await postRepository.insertPostsHashtags(postId, hashtagId);
        res.sendStatus(201);
      }
    }
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
  console.log(user);
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
