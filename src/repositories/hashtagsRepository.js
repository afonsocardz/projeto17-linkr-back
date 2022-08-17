import connection from "../config/postgres.js";

async function trendingHashtags() {
  return connection.query(
    `
        SELECT
          h."hashtagName" AS hashtag,
          COUNT(ph."hashtagId") AS trending
        FROM hashtags h
        LEFT JOIN posts_hashtags ph ON ph."hashtagId" = h.id 
        GROUP BY hashtag
        ORDER BY trending DESC, h."hashtagName" ASC
        LIMIT 10
    `
  );
}

async function searchForHashtag(newHashtag) {
  console.log("search for hashtag");
  return connection.query(
    `SELECT * FROM hashtags WHERE "hashtagName" = $1`,
    [newHashtag]
  );
}

async function returnPostsHashtags(newHashtag) {
  return connection.query(
    `
      SELECT
        p.*, u.username, u."userPicture"
      FROM posts p
      JOIN users u ON p."userId" = u.id
      JOIN posts_hashtags ph ON p.id = ph."postId"
      WHERE ph."hashtagId" = 
        (
          SELECT id
          FROM hashtags
          WHERE "hashtagName" = $1
        )
      ORDER BY p."createdAt" DESC
    `,
    [newHashtag]
  );
}

export {
  searchForHashtag,
  returnPostsHashtags,
  trendingHashtags
};
