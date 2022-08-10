import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  createSession,
  getUserByEmail,
} from "../repositories/userRepository.js";

dotenv.config();

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const { rows: user } = await getUserByEmail(email);

    if (user.length === 0) {
      res.status(401).send("E-mail e/ou senha inválidos!");
      return;
    }

    const decryptedPasswordByBcrypt = bcrypt.compareSync(
      password,
      user[0].password
    );

    const decryptedPassword = jwt.verify(
      user[0].password,
      process.env.PASSWORD_SECRET
    );
    if (password !== decryptedPassword && !decryptedPasswordByBcrypt) {
      res.status(401).send("E-mail e/ou senha inválidos!");
      return;
    }
    const token = jwt.sign(
      { email: user[0].email, username: user[0].username },
      process.env.TOKEN_SECRET
    );
    await createSession(user[0].id, token);
    res.status(200).send(token);
  } catch (err) {
    res.status(500).send("Erro interno!");
  }
}
