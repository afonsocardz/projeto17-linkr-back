import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import {
  createSession,
  getUserByEmail,
  deleteSessionByToken,
} from "../repositories/userRepository.js";

dotenv.config();

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const {
      rows: [user],
    } = await getUserByEmail(email);

    if (!user) {
      res.status(401).send("Incorrect email and/or password!");
      return;
    }

    const decryptedPasswordByBcrypt = bcrypt.compareSync(
      password,
      user.password
    );

    if (!decryptedPasswordByBcrypt) {
      res.status(401).send("Incorrect email and/or password!");
      return;
    }
    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.TOKEN_SECRET
    );

    await createSession(user.id, token);
    res.status(200).send({
      token,
      user: {
        username: user.username,
        id: user.id,
        userPicture: user.userPicture,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro interno!");
  }
}

export async function deleteSession(req, res) {
  try {
    const { token } = res.locals;
    await deleteSessionByToken(token);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro interno!");
  }
}
