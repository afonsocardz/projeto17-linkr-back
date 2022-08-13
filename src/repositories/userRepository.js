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
  [token],
  )
};

export function getUserById(userId) {
  return connection.query(`
    SELECT users.username, users."userPicture" AS "ProfileImage"
    FROM users
    WHERE users.id = $1`, [userId],
  )
};

