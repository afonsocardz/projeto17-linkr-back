SELECT
  posts.*,
  teste.likes,
  teste.names
FROM
  (
    SELECT
      posts.*,
      users.username,
      users."userPicture",
      count(posts_likes."postId") AS likes,
      (array_agg(array [users.username])) AS "whoLiked",
      count(
        CASE
          WHEN posts_likes."userId" = 2 THEN 1
        END
      ) AS "likeStatus"
    FROM
      posts
      JOIN users ON users.id = posts."userId"
      left JOIN posts_likes ON posts_likes."postId" = posts.id
    GROUP BY
      posts.id,
      users.username,
      users."userPicture"
    ORDER BY
      posts."createdAt" DESC
    LIMIT
      20
  ) AS teste,
  posts
  JOIN users ON users.id = posts."userId"
ORDER BY
  posts."createdAt" DESC
LIMIT
  20;

SELECT
  posts.*,
  users."userPicture",
  users.username,
  users.id AS "userId",
  count(posts_likes.id) AS likes,
  count(
    CASE
      WHEN posts_likes."userId" = 1 THEN 1
    END
  ) AS "likeStatus"
FROM
  posts
  JOIN users ON users.id = posts."userId"
  JOIN posts_likes ON posts_likes."postId" = posts.id
GROUP BY
  posts.id,
  users."userPicture",
  users.username,
  users.id
ORDER BY
  posts."createdAt" DESC
LIMIT
  20;

SELECT
  posts.*,
  users.username,
  count(posts_likes."postId") AS likes
FROM
  posts
  JOIN users ON users.id = posts."userId";