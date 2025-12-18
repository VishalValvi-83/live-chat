import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const mysqlDB = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,

    waitForConnections: true,
    connectionLimit: 10,

    connectTimeout: 10000,

    ...(process.env.MYSQL_SSL_CA_CONTENT && {
        ssl: {
            ca: process.env.MYSQL_SSL_CA_CONTENT,
            rejectUnauthorized: true,
        },
    }),
});


const testConnection = async () => {
    try {
        const connection = await mysqlDB.getConnection();
        await connection.ping();
        connection.release();
        console.log("✅ MySQL Connected!");
    } catch (err) {
        console.error("❌ MySQL Connection Failed:", err.message);
        process.exit(1); 
    }
};

await testConnection();

const shutdown = async () => {
    console.log("🛑 Closing MySQL pool...");
    await mysqlDB.end();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default mysqlDB;
