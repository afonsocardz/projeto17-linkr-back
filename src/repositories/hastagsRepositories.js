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


export { createHashtags, searchForHashtag, selectHashtags, trendingHashtags };
