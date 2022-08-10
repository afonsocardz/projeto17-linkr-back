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
