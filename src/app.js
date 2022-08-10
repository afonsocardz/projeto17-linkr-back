import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routers/authRouter.js";
import verifyExpiredTokens from "./middlewares/verifyExpiredTokens.js";

dotenv.config();

const app = express();

app.use([cors(), express.json()]);

app.use(authRouter);

setInterval(verifyExpiredTokens, 60000);

app.listen(process.env.PORT, () => {
  console.log(`servidor funfando de boas na porta ${process.env.PORT}`);
});
