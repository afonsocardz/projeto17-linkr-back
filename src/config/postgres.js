import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;

dotenv.config();

const MODE = process.env.MODE;
const connectionString = process.env.DATABASE_URL;
const connectionConfig = {
  connectionString,
};

if (MODE === "PROD") {
  connectionConfig.ssl = {
    rejectUnauthorized: false,
  };
  console.log(connectionConfig);
}

const connection = new Pool(connectionConfig);

export default connection;
