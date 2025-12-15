import { mysqlDB } from "../config/mysql.js";

const onlineUsers = new Set();

export const markUserOnline = async (userId) => {
  onlineUsers.add(userId);
};

export const markUserOffline = async (userId) => {
  onlineUsers.delete(userId);

  await mysqlDB.query(
    "UPDATE users SET last_seen = NOW() WHERE id = ?",
    [userId]
  );
};

export const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};
