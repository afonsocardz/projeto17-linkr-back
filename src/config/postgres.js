import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;

dotenv.config();

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connection;
