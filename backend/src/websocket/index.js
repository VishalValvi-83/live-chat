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

    socket.on("message-delivered", async ({ message_id, sender_id }) => {
      await Message.findByIdAndUpdate(message_id, { delivered_at: new Date() });

      io.to(sender_id.toString()).emit("message-status-update", {
        message_id,
        status: "delivered"
      });
    });

    socket.on("message-read", async ({ chat_id, sender_id }) => {
      await Message.updateMany(
        { chat_id, sender_id, read_at: null },
        { read_at: new Date() }
      );

      io.to(sender_id.toString()).emit("message-status-update", {
        chat_id,
        status: "read"
      });
    });

    socket.on("typing", ({ sender_id, receiver_id }) => {
      socket.to(receiver_id.toString()).emit("typing", {
        sender_id
      });
    });

    socket.on("stop-typing", (data) => {

      const { receiver_id, sender_id } = data;

  

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
