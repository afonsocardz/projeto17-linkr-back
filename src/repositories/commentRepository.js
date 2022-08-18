import connection from "../config/postgres.js";

async function insertComment(userId, { commentMessage, postId }) {
  await connection.query(`
  DO $$
      DECLARE comment_id int;
    BEGIN
      INSERT INTO comments (comment_message, "userId") VALUES ('${commentMessage}', '${userId}') RETURNING id INTO comment_id;
      INSERT INTO posts_comments ("commentId", "postId") VALUES (comment_id, '${postId}');
  END $$
  `);
}

async function selectCommentByPostId(postId){
  const {rows: comments} = await connection.query(`
    SELECT comments.comment_message, users.username from posts_comments
    join comments on comments.id = posts_comments."commentId"
    join users on users.id = comments."userId"
    where posts_comments."postId" = $1
  `,[postId]);
  return comments;
}

export const commentRepository = { insertComment, selectCommentByPostId };