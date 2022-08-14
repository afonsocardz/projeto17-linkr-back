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
        ORDER BY trending DESC
        LIMIT 20
    `
  );
}

async function selectHashtags (){
  return connection.query(`SELECT message FROM posts WHERE message LIKE '#%'`);
}

async function searchForHashtag(hashtag) {
  return connection.query(`SELECT * FROM hashtags WHERE "hashtagName" = $1`, [hashtag]);
}

async function createHashtags(hashtag) {
  return connection.query(`INSERT INTO hashtags ("hashtagName") VALUES $1`, [hashtag]);
}

async function returnPostsHashtags(hashtag){
  return connection.query(
    `
      SELECT
        p,id, p.url, p.message, p.title, p."userId", u.username, u."pictureUrl"
      FROM posts p
      JOIN users u ON p."userId" = u.id
      JOIN posts_hashtags ph ON ph."postId" = p.id
      WHERE ph."hashtagId" = (SELECT id FROM hashtags WHERE "hashtagName = $1")
      ORDER BY "createdAt" DESC
    `, [hashtag]
    );
}

export { createHashtags, searchForHashtag, selectHashtags, returnPostsHashtags, trendingHashtags };
