import path from "path";
import { Pool } from "pg";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// 模擬出 __dirname(ESModule沒有，CommonJS才有)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
	path: path.resolve(__dirname, "./.env"),
});

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	// ssl: { rejectUnauthorized: false },
	// connectionString: process.env.DB_URL,
	// ssl: {
	// 	rejectUnauthorized: false,
	// },
});

// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '09280928',
//   database: 'pin_journey',
// });

export default pool;
