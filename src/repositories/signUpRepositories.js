import connection from "../config/postgres.js";

async function checksIfEmailExists(email) {
  return connection.query("SELECT * FROM users WHERE email = $1", [email]);
}

async function checksIfUserNameExists(username) {
    return connection.query("SELECT * FROM users WHERE username = $1", [username]);
}

async function registersUser( username, email, passwordHash, pictureUrl) {

  return connection.query(
    `INSERT INTO users (username, email, password, "userPicture") 
    VALUES ($1, $2, $3, $4)`,
  [username, email, passwordHash, pictureUrl]
  );
}

export { checksIfEmailExists, checksIfUserNameExists, registersUser };
