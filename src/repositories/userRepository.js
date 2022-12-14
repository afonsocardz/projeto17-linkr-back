import connection from "../config/postgres.js";

export function getUserByEmail(email) {
  return connection.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email]
  );
}

export function createSession(userId, token) {
  return connection.query(
    `
    INSERT INTO sessions ("userId", token) VALUES ($1, $2)
    `,
    [userId, token]
  );
}

export function deleteSessionByToken(token) {
  return connection.query(
    `DELETE FROM sessions 
    WHERE token = $1`,
    [token]
  );
}

export function getUserById(userId) {
  return connection.query(
    `
    SELECT users.username, users."userPicture" AS "ProfileImage"
    FROM users
    WHERE users.id = $1`,
    [userId]
  );
}

export function getFollowedUsersByUsername(username, userId) {
  return connection.query(
    `
  SELECT u.id, u.username, u."userPicture" FROM users u WHERE LOWER(u.username) LIKE LOWER($1) AND u.id IN (SELECT "followedUserId" FROM users_followers WHERE "userId" = $2);
  `,
    [`${username}%`, userId]
  );
}

export function getUnfollowedUsersByUsername(username, userId) {
  return connection.query(
    `
  SELECT u.id, u.username, u."userPicture" FROM users u WHERE LOWER(u.username) LIKE LOWER($1) AND u.id NOT IN (SELECT "followedUserId" FROM users_followers WHERE "userId" = $2);
  `,
    [`${username}%`, userId]
  );
}

export function getFollowedsByUserId(userId) {
  return connection.query(
    `
  SELECT "followedUserId" FROM users_followers WHERE "userId" = $1
  `,
    [userId]
  );
}

export function insertFollowedUser(userId, followedUserId) {
  return connection.query(
    `
  INSERT INTO users_followers ("userId", "followedUserId") VALUES ($1, $2)
  `,
    [userId, followedUserId]
  );
}

export function deleteFollowedUser(userId, followedUserId) {
  return connection.query(
    `
  DELETE FROM users_followers WHERE "userId" = $1 AND "followedUserId" = $2
  `,
    [userId, followedUserId]
  );
}
