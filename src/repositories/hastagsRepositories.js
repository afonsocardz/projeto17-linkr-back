import connection from "../config/postgres.js";

async function trendingHashtags() {
  return connection.query(
    `
        SELECT COUNT(h."hashtagName") AS trending 
        FROM hashtags h
        GROUP BY h."hashtagName"
        ORDER BY trending DESC
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
