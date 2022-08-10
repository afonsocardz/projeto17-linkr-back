import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getUserByToken,
  updateToken,
} from "../repositories/tokenRepository.js";

dotenv.config();

async function validateToken(request, response, next) {
  const { authorization } = request.headers;
  const token = authorization?.replace("Bearer ", "");

  const { email } = jwt.verify(token, process.env.TOKEN_SECRET);

  const { rows: user } = await getUserByToken(token);

  if (user.length === 0 || user[0]?.email !== email) {
    response.status(401).send();
    return;
  }

  await updateToken(token);

  response.locals.user = user[0];

  next();
}

export default validateToken;
