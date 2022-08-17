import connection from "../config/postgres.js";

async function createPost(
  userId,
  { url, message = null, image, description, title }
) {
  return await connection.query(
    `
    INSERT INTO posts (url, message, "userId", description, image, title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [url, message, userId, description, image, title]
  );
}

async function getAllPosts(userId) {
  if (userId === "undefined") {
    userId = 0;
  }
  const { rows: posts } = await connection.query(`
    SELECT posts.*, users."userPicture", users.username, users.id as "userId" FROM posts 
    JOIN users ON users.id = posts."userId"
    ORDER BY posts."createdAt" DESC;
  `);
  
  const countedPost = await Promise.all(
    posts.map(async (post) => {
      const {
        rows: [likesCount],
      } = await connection.query(
        `
      SELECT count(posts_likes.id) as likes, count(case when posts_likes."userId" = $2 and posts_likes."postId" = $1 then 1 end) as "likeStatus" FROM posts_likes JOIN users ON users.id = posts_likes."userId"
      WHERE posts_likes."postId" = $1 
    `,
        [post.id, userId]
      );
      const { rows: whoLiked } = await connection.query(
        `
      SELECT users.username FROM posts_likes JOIN users ON users.id = posts_likes."userId" WHERE posts_likes."postId" = $1 AND posts_likes."userId" != $2
      LIMIT 2;
    `,
        [post.id, userId]
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

async function deletePostById(postId){
  await connection.query(`
    DELETE FROM posts WHERE id = $1
  `,[postId]);
}

async function likeByPostId(postId, userId) {
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
  if (userId === "undefined") {
    userId = 0;
  }

  const { rows: posts } = await connection.query(
    `
  SELECT p.*, u."userPicture", u.username, u.id as "userId" FROM posts p
    JOIN users u ON u.id = p."userId" WHERE p."userId" = $1
    ORDER BY p."createdAt" DESC;
  `,
    [searchedUserId]
  );

  const countedPost = await Promise.all(
    posts.map(async (post) => {
      const {
        rows: [likesCount],
      } = await connection.query(
        `
      SELECT count(posts_likes.id) as likes, count(case when posts_likes."userId" = $2 and posts_likes."postId" = $1 then 1 end) as "likeStatus" FROM posts_likes JOIN users ON users.id = posts_likes."userId"
      WHERE posts_likes."postId" = $1 
    `,
        [post.id, userId]
      );
      const { rows: whoLiked } = await connection.query(
        `
      SELECT users.username FROM posts_likes JOIN users ON users.id = posts_likes."userId" WHERE posts_likes."postId" = $1 AND posts_likes."userId" != $2
      LIMIT 2;
    `,
        [post.id, userId]
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

async function editPostById(postId, userId, message){
  await connection.query(`
    UPDATE posts SET message = $1 WHERE id = $2 AND "userId" = $3
  `, [message, postId, userId]);
}
async function insertPostsHashtags(postId, hashtagId){
  return connection.query(`INSERT INTO posts_hashtags ("postId", "hashtagId") VALUES ($1, $2)`, [postId, hashtagId]);
}

async function searchForHashtag(hashtag) {
  return connection.query(`SELECT * FROM hashtags WHERE "hashtagName" = $1`, [hashtag]);
}

async function createHashtags(hashtag) {
  return connection.query(`INSERT INTO hashtags ("hashtagName") VALUES ($1) RETURNING id`, [hashtag]);
}

export const postRepository = {
  createPost,
  getAllPosts,
  insertPostsHashtags,
  searchForHashtag,
  createHashtags,
  likeByPostId,
  getPostsById,
  editPostById,
  deletePostById,
};
