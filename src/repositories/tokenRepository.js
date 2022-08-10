import connection from "../config/postgres.js";

export function getUserByToken(token) {
  return connection.query(
    `
      SELECT u.* FROM sessions s JOIN users u ON s."userId" = u.id WHERE token = $1
      `,
    [token]
  );
}

export function updateToken(token) {
  return connection.query(
    `
      UPDATE sessions SET "createdAt" = $1 WHERE token = $2
      `,
    [new Date(), token]
  );
}

export function deleteExpired(expireDate) {
  return connection.query(
    `
  DELETE FROM sessions WHERE "createdAt" < $1
  `,
    [expireDate]
  );
}
