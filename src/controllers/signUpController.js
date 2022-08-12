import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  checksIfEmailExists,
  checksIfUserNameExists,
  registersUser,
} from "../repositories/signUpRepositories.js";

dotenv.config();

export async function signUpUsers(req, res) {
  const { email, password, username, pictureUrl } = req.body;
  const salt = Number(process.env.HASH_ROUNDS);

  const passwordHash = bcrypt.hashSync(password, salt);

  try {
    const { rowCount: emails } = await checksIfEmailExists(email);

    if (emails === 1) return res.status(409).send("Email already registered");

    const { rowCount: usernames } = await checksIfUserNameExists(username);

    if (usernames === 1) return res.status(409).send("User already registered");

    await registersUser(username, email, passwordHash, pictureUrl);

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
