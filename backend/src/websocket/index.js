import Message from "../models/ChatMessage.js";
import { Server } from "socket.io";
import { markUserOffline, markUserOnline } from "../services/presence.service.js";

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:",);

    
    socket.on("join", async (userId) => {
      socket.userId = userId;   
      socket.join(userId.toString());

      await markUserOnline(userId);
      console.log(`User ${userId} is ONLINE`);
    });

    
    socket.on("send-message", (data) => {
      io.to(data.receiver_id).emit("receive-message", data);
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        await markUserOffline(socket.userId);
        console.log(`User ${socket.userId} is OFFLINE`);
      }
    });

    socket.on("message-delivered", (messageId) => {
      Message.findByIdAndUpdate(messageId, {
        delivered_at: new Date()
      });
    });

    socket.on("message-read", (chat_id, user_id) => {
      io.to(user_id.toString()).emit("message-read", { chat_id });
      Message.updateMany(
        { chat_id, receiver_id: user_id, read_at: null },
        { read_at: new Date() }
      );
    });

    socket.on("typing", ({ sender_id, receiver_id }) => {
      socket.to(receiver_id.toString()).emit("typing", {
        sender_id
      });
    });

    socket.on("stop-typing", (data) => {
      
      const { receiver_id, sender_id } = data; 

      // console.log("Stop-typing:", data);

      if (!receiver_id || !sender_id) return; 

      socket.to(receiver_id.toString()).emit("stop-typing", {
        sender_id: sender_id, 
        receiver_id: receiver_id
      });
    });

  });

  return io;
};

export const getIO = () => io;
