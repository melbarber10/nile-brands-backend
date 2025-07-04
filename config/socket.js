import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// cors is used to allow cross-origin requests
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:4200",    // Angular development
      "*"                        // Allow all origins (for Flutter mobile)
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}

function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`🟢 User ${userId} mapped to socket ${socket.id}`);
  };

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
    const disconnectedUser = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (disconnectedUser) {
      delete userSocketMap[disconnectedUser];
      console.log(`🔴 User ${disconnectedUser} removed from online list`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
  console.log(userSocketMap)
});

export { io, app, server, getReceiverSocketId };