const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WEBRTC_CONFIG = require("./config/webrtcConfig");

const PORT = process.env.PORT || 5000;
const SIGNALING_PORT = WEBRTC_CONFIG.SIGNALING_PORT || 5050; 

const app = require("./app");
const apiServer = http.createServer(app); // API server
const signalingServer = http.createServer(); // WebRTC Signaling server

const io = new Server(signalingServer, {
  cors: {
    origin: WEBRTC_CONFIG.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

console.log("Allowed frontend URL:", WEBRTC_CONFIG.FRONTEND_URL);

// WebRTC Socket Logic
io.on("connection", (socket) => {
  console.log("New user connected");

  // **User Registration (for notifications & chat)**
  socket.on("register", (userId) => {
    activeUsers[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
  });

  // **WebRTC Signaling**
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });
  
  // **One-to-One Chat**
  socket.on("send-message", ({ senderId, recipientId, message }) => {
    const recipientSocket = activeUsers[recipientId];
    if (recipientSocket) {
      io.to(recipientSocket).emit("receive-message", { senderId, message });
    }
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(activeUsers).find((key) => activeUsers[key] === socket.id);
    if (userId) {
      delete activeUsers[userId];
      console.log(`User ${userId} disconnected`);
    }
  });
});

// **Express Server on 5000**
apiServer.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

// **Socket Server on 5050**
signalingServer.listen(SIGNALING_PORT, () => {
  console.log(`WebRTC Signaling Server running on port ${SIGNALING_PORT}`);
});
