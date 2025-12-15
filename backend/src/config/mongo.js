import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const mongoDB = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));