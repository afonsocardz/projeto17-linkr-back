import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routers from "./routers/index.js";

dotenv.config();

const app = express();

app.use(json());
app.use(cors());

app.use(routers);

app.listen(process.env.PORT, () => {
  console.log(`servidor funfando de boas na porta ${process.env.PORT}`);
});
