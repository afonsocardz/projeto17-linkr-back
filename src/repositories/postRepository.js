import connection from "../config/postgres.js";

async function createPost(userId, { url, message = null, image, description, title }) {
  await connection.query(`
    INSERT INTO posts (url, message, "userId", description, image, title) VALUES ($1, $2, $3, $4, $5, $6)`,
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

export const postRepository = {
  createPost,
  getAllPosts
};