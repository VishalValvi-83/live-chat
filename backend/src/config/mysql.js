import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create pool
export const mysqlDB = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10
});

// Test connection
try {
    const connection = await mysqlDB.getConnection();
    console.log("✅ MySQL Connected!");
    connection.release();
} catch (err) {
    console.error("❌ MySQL Connection Failed:", err);
}

export default mysqlDB;
