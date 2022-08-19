import connection from "../config/postgres.js";

async function insertComment(userId, { commentMessage, postId }) {
  await connection.query(`
    INSERT INTO comments (comment_message, "userId", "postId") VALUES ($1, $2, $3)
  `,[commentMessage, userId, postId]);
}

async function selectCommentByPostId(postId, userId) {
  const { rows: comments } = await connection.query(`
  SELECT
    comments."userId",
    comments.comment_message,
    users.username,
    CASE
      WHEN comments."userId" = posts."userId" THEN 'Author'
      when comments."userId" = f."followedUserId" then 'Following'
    END AS STATUS
  FROM
    comments
    inner JOIN users ON users.id = comments."userId"
    inner JOIN posts ON posts.id = comments."postId"
    left join users_followers as f on f."followedUserId" = comments."userId" and f."userId" = $2
  WHERE
    comments."postId" = $1;
  `, [postId, userId]);
  return comments;
}

export const commentRepository = { insertComment, selectCommentByPostId };