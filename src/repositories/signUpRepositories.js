import connection from "../config/postgres.js";

async function checksIfEmailExists(email) {
  return connection.query("SELECT * FROM users WHERE email = $1", [email]);
}

async function checksIfUserNameExists(username) {
    return connection.query("SELECT * FROM users WHERE username = $1", [username]);
}

async function registersUser( username, email, passwordHash, pictureUrl) {
  const data = new Date();

  return connection.query(
    `INSERT INTO users (name, username, email, password, "userPicture", "createdAt") 
    VALUES ($1, $2, $3, $4, $5, $6)`,
  [username, username, email, passwordHash, pictureUrl, data]
  );
}

export { checksIfEmailExists, checksIfUserNameExists, registersUser };
