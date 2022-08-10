import connection from "../config/postgres.js";

async function createPost(userId, today, { url, message = null }) {
  await connection.query(`
    INSERT INTO posts (url, message, "userId", "createdAt") VALUES ($1, $2, $3, $4)`,
    [url, message, userId, today]);
}

async function getAllPosts(){
  const {rows: posts} = await connection.query(`SELECT * FROM posts ORDER BY "createdAt" DESC`);
  return posts;
}

export const postRepository = {
  createPost,
  getAllPosts
};