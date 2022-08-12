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


export { trendingHashtags };
