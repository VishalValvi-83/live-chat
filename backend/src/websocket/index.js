// import Message from "../models/ChatMessage.js";
// import { Server } from "socket.io";
// import { markUserOffline, markUserOnline } from "../services/presence.service.js";

// let io = null;

// export const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"]
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("User connected:",);


//     socket.on("join", async (userId) => {
//       socket.userId = userId;
//       socket.join(userId.toString());

//       await markUserOnline(userId);
//       console.log(`User ${userId} is ONLINE`);

//       socket.emit("join_success", { userId, status: "online" });

//       socket.broadcast.emit("user-online", { userId });
//     });


//     socket.on("send-message", (data) => {
//       io.to(data.receiver_id).emit("receive-message", data);
//     });

//     socket.on("disconnect", async () => {
//       if (socket.userId) {
//         await markUserOffline(socket.userId);
//         console.log(`User ${socket.userId} is OFFLINE`);

//         socket.broadcast.emit("user-offline", { userId: socket.userId });
//       }
//     });
//     socket.on("reconnect", async () => {
//       if (socket.userId) {
//         await markUserOnline(socket.userId);
//         socket.broadcast.emit("user-online", { userId: socket.userId });
//       }
//     });

//     socket.on("message-delivered", async ({ message_id, sender_id }) => {
//       await Message.findByIdAndUpdate(message_id, { delivered_at: new Date() });

//       io.to(sender_id.toString()).emit("message-status-update", {
//         message_id,
//         status: "delivered"
//       });
//     });

//     socket.on("message-read", async ({ chat_id, sender_id }) => {
//       await Message.updateMany(
//         { chat_id, sender_id, read_at: null },
//         { read_at: new Date() }
//       );

//       io.to(sender_id.toString()).emit("message-status-update", {
//         chat_id,
//         status: "read"
//       });
//     });

//     socket.on("typing", ({ sender_id, receiver_id }) => {
//       socket.to(receiver_id.toString()).emit("typing", {
//         sender_id
//       });
//     });

//     socket.on("stop-typing", (data) => {

//       const { receiver_id, sender_id } = data;


//       if (!receiver_id || !sender_id) return;

//       socket.to(receiver_id.toString()).emit("stop-typing", {
//         sender_id: sender_id,
//         receiver_id: receiver_id
//       });
//     });

//     socket.on("error", (error) => {
//       console.error("Socket error:", error);
//     });

//   });

//   return io;
// };

// export const getIO = () => io;


// import Message from "../models/ChatMessage.js";
// import { Server } from "socket.io";
// import { markUserOffline, markUserOnline } from "../services/presence.service.js";
// import jwt from "jsonwebtoken";

// let io = null;

// export const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"]
//     }
//   });


//   io.use((socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;

//       if (!token) {
//         return next(new Error("Authentication error: No token provided"));
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       socket.userId = decoded.id;
//       next();

//     } catch (err) {
//       console.error("Socket Auth Error:", err.message);
//       next(new Error("Authentication error"));
//     }
//   });

//   io.on("connection", async (socket) => {
//     console.log(`User connected: ${socket.userId}`);

//     socket.join(socket.userId.toString());
//     await markUserOnline(socket.userId);

//     socket.emit("join_success", { userId: socket.userId, status: "online" });
//     socket.broadcast.emit("user-online", { userId: socket.userId });


//     socket.on("send-message", (data) => {
//       if (data.sender_id !== socket.userId) {
//         return;
//       }
//       io.to(data.receiver_id).emit("receive-message", data);
//     });

//     socket.on("disconnect", async () => {
//       if (socket.userId) {
//         await markUserOffline(socket.userId);
//         console.log(`User ${socket.userId} is OFFLINE`);
//         socket.broadcast.emit("user-offline", { userId: socket.userId });
//       }
//     });

//     socket.on("reconnect", async () => {
//       if (socket.userId) {
//         await markUserOnline(socket.userId);
//         socket.broadcast.emit("user-online", { userId: socket.userId });
//       }
//     });

//     // socket.on("message-delivered", async ({ message_id, sender_id }) => {
//     //   await Message.findByIdAndUpdate(message_id, { delivered_at: new Date() });

//     //   io.to(sender_id.toString()).emit("message-status-update", {
//     //     message_id,
//     //     status: "delivered"
//     //   });
//     // });

//     // socket.on("message-delivered", async ({ message_id, sender_id }) => {
//     //   const message = await Message.findByIdAndUpdate(
//     //     message_id,
//     //     { delivered_at: new Date() },
//     //     { new: true }
//     //   );

//     //   if (message) {
//     //     io.to(sender_id.toString()).emit("message-status-update", {
//     //       chat_id: message.chat_id,
//     //       message_id: message._id.toString(),
//     //       status: "delivered"
//     //     });
//     //   }
//     // });

//     // socket.on("message-read", async ({ chat_id, sender_id }) => {
//     //   await Message.updateMany(
//     //     { chat_id, sender_id, read_at: null },
//     //     { read_at: new Date() }
//     //   );

//     //   io.to(sender_id.toString()).emit("message-status-update", {
//     //     chat_id,
//     //     status: "read"
//     //   });
//     // });


//     socket.on("message-delivered", async ({ message_id, sender_id }) => {
//       // 1. Update DB and return the new document ({ new: true })
//       const message = await Message.findByIdAndUpdate(
//         message_id,
//         { delivered_at: new Date() },
//         { new: true }
//       );

//       if (message) {
//         // 2. Emit update with chat_id and String message_id
//         io.to(sender_id.toString()).emit("message-status-update", {
//           chat_id: message.chat_id,        // Needed for ChatList update
//           message_id: message._id.toString(), // Needed for strict equality check ===
//           status: "delivered"
//         });
//       }
//     });

//     socket.on("message-read", async ({ chat_id, sender_id }) => {
//       // Update ALL unread messages
//       await Message.updateMany(
//         { chat_id, sender_id, read_at: null },
//         { read_at: new Date() }
//       );

//       // Emit "read" status
//       io.to(sender_id.toString()).emit("message-status-update", {
//         chat_id,
//         status: "read"
//       });
//     });

//     socket.on("typing", ({ sender_id, receiver_id }) => {
//       if (sender_id !== socket.userId) return;

//       socket.to(receiver_id.toString()).emit("typing", {
//         sender_id
//       });
//     });

//     socket.on("stop-typing", (data) => {
//       const { receiver_id, sender_id } = data;
//       if (!receiver_id || !sender_id) return;
//       if (sender_id !== socket.userId) return;

//       socket.to(receiver_id.toString()).emit("stop-typing", {
//         sender_id: sender_id,
//         receiver_id: receiver_id
//       });
//     });

//     socket.on("error", (error) => {
//       console.error("Socket error:", error);
//     });
//   });

//   return io;
// };

// export const getIO = () => io;

import Message from "../models/ChatMessage.js";
import { Server } from "socket.io";
import { markUserOffline, markUserOnline } from "../services/presence.service.js";
import jwt from "jsonwebtoken";
import chatRoom from "../models/chatRoom.js";

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error: No token provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    socket.join(socket.userId.toString());

    const userGroups = await chatRoom.find({ participants: { $in: [Number(socket.userId)] } });
    userGroups.forEach(group => {
      socket.join(group._id.toString());
      console.log(`User ${socket.userId} joined Group ${group.name} (${group._id})`);
    });

    await markUserOnline(socket.userId);
    socket.emit("join_success", { userId: socket.userId, status: "online" });
    socket.broadcast.emit("user-online", { userId: socket.userId });

    socket.on("send-message", (data) => {
      if (data.sender_id !== socket.userId) return;
      io.to(data.receiver_id).emit("receive-message", data);
    });

    socket.on("message-delivered", async ({ message_id, sender_id }) => {
      const message = await Message.findByIdAndUpdate(
        message_id,
        {
          delivered_at: new Date(),
          status: "delivered"
        },
        { new: true }
      );

      if (message) {
        io.to(sender_id.toString()).emit("message-status-update", {
          chat_id: message.chat_id,
          message_id: message._id.toString(),
          status: "delivered"
        });
      }
    });

    socket.on("message-read", async ({ chat_id, sender_id }) => {
      await Message.updateMany(
        { chat_id, sender_id, read_at: null },
        {
          read_at: new Date(),
          status: "read"
        }
      );

      io.to(sender_id.toString()).emit("message-status-update", {
        chat_id,
        status: "read"
      });
    });

    socket.on("typing", ({ sender_id, receiver_id }) => {
      if (sender_id !== socket.userId) return;
      socket.to(receiver_id.toString()).emit("typing", { sender_id });
    });

    socket.on("stop-typing", ({ receiver_id, sender_id }) => {
      if (!receiver_id || !sender_id || sender_id !== socket.userId) return;
      socket.to(receiver_id.toString()).emit("stop-typing", { sender_id, receiver_id });
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        await markUserOffline(socket.userId);
        socket.broadcast.emit("user-offline", { userId: socket.userId });
      }
    });

    socket.on("reconnect", async () => {
      if (socket.userId) {
        await markUserOnline(socket.userId);
        socket.broadcast.emit("user-online", { userId: socket.userId });
      }
    });
  });

  return io;
};

export const getIO = () => io;