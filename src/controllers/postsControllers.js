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
    const postId = rows[0].id;

    const postMessage = post.message;
    const filterPostMessage = postMessage
      .split(" ")
      .filter((word) => word.startsWith("#"));
    const size = filterPostMessage.length;

    if (size === 0) {
      return res.sendStatus(201);
    } else {
      for (let i = 0; i < size; i++) {
        const { rows, rowCount: metHashtag } =
          await postRepository.searchForHashtag(filterPostMessage[i]);

        if (metHashtag === 1) {
          const hashtagId = rows[0].id;
          await postRepository.insertPostsHashtags(postId, hashtagId);
        } else {
          const { rows } = await postRepository.createHashtags(
            filterPostMessage[i]
          );
          const hashtagId = rows[0].id;
          await postRepository.insertPostsHashtags(postId, hashtagId);
        }
      }
      res.sendStatus(201);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send([{ msg: "Erro ao fazer a postagem", label: "error" }]);
  }
}

async function deletePost(req, res) {
  const { id } = req.params;
  try {
    await postRepository.deletePostById(id);
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function editPost(req, res) {
  const { id } = req.params;
  const { message } = req.body;
  const user = res.locals.user;
  try {
    await postRepository.editPostById(id, user.id, message);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function getPosts(req, res) {
  const { id } = req.query;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const posts = await postRepository.getAllPosts(id, limit);
    const newPosts = await posts.slice(startIndex, endIndex);

    res.status(200).send(newPosts);
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
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  try {
    const posts = await postRepository.getPostsById(id, searchedUserId);
    const newPosts = await posts.slice(startIndex, endIndex);

    res.status(200).send(newPosts);
  } catch (err) {
    console.log(err);
    res.status(500).send([{ msg: "Erro o carregar os posts", label: "error" }]);
  }
}

export { createPost, getPosts, likePost, getUserPosts, editPost, deletePost };
