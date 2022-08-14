import connection from "../config/postgres.js";

async function createPost(
  userId,
  { url, message = null, image, description, title }
) {
  await connection.query(
    `
    INSERT INTO posts (url, message, "userId", description, image, title) VALUES ($1, $2, $3, $4, $5, $6)`,
    [url, message, userId, description, image, title]
  );
}

async function getAllPosts(userId) {
  let id = userId;
  if (id === "undefined") {
    id = 0;
  }
  const { rows: posts } = await connection.query(`
    SELECT posts.*, users."userPicture", users.username, users.id FROM posts 
    JOIN users ON users.id = posts."userId"
    ORDER BY posts."createdAt" DESC LIMIT 20;
  `);

  const countedPost = await Promise.all(
    posts.map(async (post) => {
      const {
        rows: [likesCount],
      } = await connection.query(
        `
      SELECT count(posts_likes.id) as likes, count(case when posts_likes."userId" = $2 then 1 end) as "likeStatus" FROM posts_likes JOIN users ON users.id = posts_likes."userId"
      WHERE posts_likes."postId" = $1 
    `,
        [post.id, id]
      );
      const { rows: whoLiked } = await connection.query(
        `
      SELECT users.username FROM posts_likes JOIN users ON users.id = posts_likes."userId" WHERE posts_likes."postId" = $1 AND posts_likes."userId" != $2
      LIMIT 2;
    `,
        [post.id, id]
      );
      const { likes, likeStatus } = likesCount;
      const status = likeStatus == 1 ? true : false;
      const newObj = {
        ...post,
        likes,
        likeStatus: status,
        whoLiked,
      };
      console.log(whoLiked);
      return newObj;
    })
  );

  console.log(countedPost);

  return countedPost;
}

async function likeByPostId(postId, userId) {
  console.log(postId, userId);
  const {
    rows: [findLike],
  } = await connection.query(
    `
    SELECT * FROM posts_likes WHERE "postId" = $1 AND "userId" = $2
  `,
    [postId, userId]
  );

  if (findLike) {
    await connection.query(
      `
      DELETE FROM posts_likes WHERE "postId" = $1 AND "userId" = $2 
    `,
      [postId, userId]
    );
  } else {
    await connection.query(
      `
    INSERT INTO posts_likes ("postId", "userId") VALUES ($1, $2)
  `,
      [postId, userId]
    );
  }
}

async function getPostsById(userId, searchedUserId) {
  let id = userId;

  const { rows: posts } = await connection.query(
    `
  SELECT p.*, u."userPicture", u.username, u.id FROM posts p
    JOIN users u ON u.id = p."userId" WHERE p."userId" = $1
    ORDER BY p."createdAt" DESC LIMIT 20;
  `,
    [searchedUserId]
  );

  const countedPost = await Promise.all(
    posts.map(async (post) => {
      const {
        rows: [likesCount],
      } = await connection.query(
        `
      SELECT count(posts_likes.id) as likes, count(case when posts_likes."userId" = $2 then 1 end) as "likeStatus" FROM posts_likes JOIN users ON users.id = posts_likes."userId"
      WHERE posts_likes."postId" = $1 
    `,
        [post.id, id]
      );
      const { rows: whoLiked } = await connection.query(
        `
      SELECT users.username FROM posts_likes JOIN users ON users.id = posts_likes."userId" WHERE posts_likes."postId" = $1 AND posts_likes."userId" != $2
      LIMIT 2;
    `,
        [post.id, id]
      );
      const { likes, likeStatus } = likesCount;
      const status = likeStatus == 1 ? true : false;
      const newObj = {
        ...post,
        likes,
        likeStatus: status,
        whoLiked,
      };
      return newObj;
    })
  );

  return countedPost;
}

export const postRepository = {
  createPost,
  getAllPosts,
  likeByPostId,
  getPostsById,
};
