import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth/authRoutes.js";
import messageRoutes from './routes/messageRoute.js'
import chatRoutes from "./routes/chatRoutes.js"
import userRoutes from './routes/userRoutes.js'
import "./config/mysql.js";
import "./config/mongo.js";
import dotenv from "dotenv";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter.js";
dotenv.config();

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Live Chat Backend Running...");
});

app.use("/api/", apiLimiter);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/messages", messageRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/user", userRoutes)
export default app;
