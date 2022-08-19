import connection from "../config/postgres.js";

async function shares(userId) {
  return connection.query(
    `
    SELECT 
        p.id,
        p.title,
        p.url,
        p.message,
        p."userId" AS "postOwner",
        p."createdAt" AS "postedTime",
        u.username, u."userPicture",
        FALSE AS "isRepost",
        NULL AS "repostOwner",
        NULL AS "repostUser",
        (
            SELECT COUNT(ur.id)
            FROM users_reposts ur
            WHERE ur."postId" = p.id
        ) AS reposts,
        (
            SELECT COUNT(c.id)
            FROM comments c
            WHERE c."postId" = p.id
        ) AS comments,
        (
            SELECT ARRAY_AGG(
                jsonb_build_object(
                    'userId', u.id,
                    'username', u.username
                ))
                FROM posts_likes pl
                JOIN users u ON u.id = pl."userId"
                WHERE pl."postId" = p.id
        ) AS "whoLiked",
        EXISTS (
            SELECT *
            FROM posts_likes pl
            WHERE pl."postId" = p.id AND pl."userId" = $1
            ) AS "likeStatus"
    FROM 
        posts p
    JOIN users u ON u.id = p."userId"
    LEFT JOIN posts_likes pl ON pl."postId" = p.id
    WHERE p."userId" = ANY
        ( 
            SELECT uf."followedUserId"
            FROM users_followers uf
            WHERE uf."followedUserId" = $1
        )
        OR p."userId" = $1
    GROUP BY p.id, u.id
    UNION
    SELECT
        p.id, p.title, p.url, p.message,
        p."userId" AS "postOwner", p."createdAt" AS "postedTime",
        u1.username, u1."userPicture",
        TRUE AS "isRepost",
        ur."userId" AS "repostOwner", u2.username AS "repostUser",

        (
            SELECT COUNT(ur.id)
            FROM users_reposts ur
            WHERE ur."postId" = p.id
        ) AS reposts,
        (
            SELECT COUNT(c.id)
            FROM comments c
            WHERE c."postId" = p.id
        ) AS comments,
        (
            SELECT ARRAY_AGG(
                jsonb_build_object(
                    'userId', u.id,
                    'username', u.username
                ))
                FROM posts_likes pl
                JOIN users u ON u.id = pl."userId"
                WHERE pl."postId" = p.id
        ) AS "whoLiked",
        EXISTS (
            SELECT *
            FROM posts_likes pl
            WHERE pl."postId" = p.id AND pl."userId" = $1
            ) AS "likeStatus"
    FROM posts p
    JOIN users u1 ON u1.id = p."userId"
    JOIN users_reposts ur ON ur."postId" = p.id
    LEFT JOIN posts_likes pl ON pl."postId" = p.id
    JOIN users u2 ON ur."userId" = u2.id
    WHERE p."userId" = ANY
        ( 
            SELECT uf."followedUserId"
            FROM users_followers uf
            WHERE uf."followedUserId" = $1
        )
        OR p."userId" = $1
    GROUP BY 
        p.id,
        u1.id,
        ur."userId",
        u2.id,
        ur."createdAt"

    `,
    [userId]
  );
}

async function respostPostId(postId, userId) {
  const {
    rows: [findRepost],
  } = await connection.query(
    `SELECT * FROM users_reposts WHERE "postId" = $1 AND "userId" = $2 `,
    [postId, userId]
  );

  if (findRepost) {
    await connection.query(
      `DELETE FROM user users_reposts WHERE "postId" = $1 AND "userId" = $2`,
      [postId, userId]
    );
  } else {
    await connection.query(
      `ÌNSERT INTO users_reposts ("postId", "userId") VALUES ($1, $2)`,
      [postId, userId]
    );
  }
}
export { shares, respostPostId };
