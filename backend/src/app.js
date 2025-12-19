import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth/authRoutes.js";
import messageRoutes from './routes/messageRoute.js'
import chatRoutes from "./routes/chatRoutes.js"
import userRoutes from './routes/userRoutes.js'
import "./config/mysql.js";
import "./config/mongo.js";
import dotenv, { config } from "dotenv";


const app = express();
dotenv.config(app)
app.use(cors());
app.use(bodyParser.json());



app.get("/", (req, res) => {
  res.send("Live Chat Backend Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/user", userRoutes)
export default app;
