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
  const { rows: posts } = await connection.query(
    `
    SELECT
      posts.*,
      users.username,
      users."userPicture",
      count(posts_likes."postId") AS likes,
      comments.count AS comments,
      who_liked."whoLiked" as "whoLiked",
      count(
        CASE
          WHEN posts_likes."userId" = $1 THEN 1
        END
      ) AS "likeStatus"
    FROM
      (
        SELECT
          posts.id AS "postId",
          COUNT(comments."postId") AS count
        FROM
          comments
          RIGHT JOIN posts ON posts.id = comments."postId"
        GROUP BY
          posts.id
      ) AS comments,
      (
        SELECT
          posts.id AS "postId",
          (array_agg(users.username))[0:3] as "whoLiked"
        FROM
          posts
          LEFT JOIN posts_likes ON posts.id = posts_likes."postId"
          LEFT JOIN users ON users.id = posts_likes."userId"
        GROUP BY
          posts.id
      ) AS who_liked,
      posts
      JOIN users ON users.id = posts."userId"
      LEFT JOIN posts_likes ON posts_likes."postId" = posts.id
    WHERE
      posts."userId" IN (
        SELECT
          "followedUserId"
        FROM
          users_followers
        WHERE
          "userId" = $1
      )
      AND comments."postId" = posts.id
      AND who_liked."postId" = posts.id
    GROUP BY
      posts.id,
      users.username,
      users."userPicture",
      comments.count,
      who_liked."whoLiked"
    ORDER BY
      posts."createdAt" DESC
  `, [userId]);

  const mappedPosts = posts.map(post => post.likeStatus == 1 ? {...post, likeStatus: true} : {...post, likeStatus: false} );
  return mappedPosts;
}

async function deletePostById(postId) {
  await connection.query(
    `
    DELETE FROM posts WHERE id = $1
  `,
    [postId]
  );
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
    SELECT
    posts.*,
    users.username,
    users."userPicture",
    count(posts_likes."postId") AS likes,
    comments.count AS comments,
    who_liked."whoLiked" as "whoLiked",
    count(
      CASE
        WHEN posts_likes."userId" = $1 THEN 1
      END
    ) AS "likeStatus"
  FROM
    (
      SELECT
        posts.id AS "postId",
        COUNT(comments."postId") AS count
      FROM
        comments
        RIGHT JOIN posts ON posts.id = comments."postId"
      GROUP BY
        posts.id
    ) AS comments,
    (
      SELECT
        posts.id AS "postId",
        (array_agg(users.username))[0:3] as "whoLiked"
      FROM
        posts
        LEFT JOIN posts_likes ON posts.id = posts_likes."postId"
        LEFT JOIN users ON users.id = posts_likes."userId"
      GROUP BY
        posts.id
    ) AS who_liked,
    posts
    JOIN users ON users.id = posts."userId"
    LEFT JOIN posts_likes ON posts_likes."postId" = posts.id
  WHERE
    posts."userId" IN (
      SELECT
        "followedUserId"
      FROM
        users_followers
      WHERE
        "userId" = $1
    )
    AND comments."postId" = posts.id
    AND who_liked."postId" = posts.id
    AND posts."userId" = $2
  GROUP BY
    posts.id,
    users.username,
    users."userPicture",
    comments.count,
    who_liked."whoLiked"
  ORDER BY
    posts."createdAt" DESC
  `,
    [userId, searchedUserId]
  );
  const mappedPosts = posts.map((post) =>
    post.likeStatus == 1
      ? { ...post, likeStatus: true }
      : { ...post, likeStatus: false }
  );
  return mappedPosts;
}

async function editPostById(postId, userId, message) {
  await connection.query(
    `
    UPDATE posts SET message = $1 WHERE id = $2 AND "userId" = $3
  `,
    [message, postId, userId]
  );
}
async function insertPostsHashtags(postId, hashtagId) {
  return connection.query(
    `INSERT INTO posts_hashtags ("postId", "hashtagId") VALUES ($1, $2)`,
    [postId, hashtagId]
  );
}

async function searchForHashtag(hashtag) {
  return connection.query(`SELECT * FROM hashtags WHERE "hashtagName" = $1`, [
    hashtag,
  ]);
}

async function createHashtags(hashtag) {
  return connection.query(
    `INSERT INTO hashtags ("hashtagName") VALUES ($1) RETURNING id`,
    [hashtag]
  );
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
