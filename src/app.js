import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use([cors(), express.json()]);

app.use(authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`servidor funfando de boas na porta ${process.env.PORT}`);
});
