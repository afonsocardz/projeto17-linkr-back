import dayjs from "dayjs";
import { deleteExpired } from "../repositories/tokenRepository.js";

async function verifyExpiredTokens() {
  const expireDate = dayjs(new Date()).subtract(20, "minutes").$d;

  await deleteExpired(expireDate);
}

export default verifyExpiredTokens;
