import connection from "../config/postgres.js";

async function createPost(userId, { url, message = null, image, description, title }) {
  return connection.query(`
    INSERT INTO posts (url, message, "userId", description, image, title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [url, message, userId, description, image, title]);
}

async function getAllPosts(){
  const {rows: posts} = await connection.query(`
    SELECT posts.*, users."userPicture", users.username FROM posts 
    JOIN users ON users.id = posts."userId"
    ORDER BY posts."createdAt" DESC LIMIT 20;
  `);
  return posts;
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
  createHashtags
};