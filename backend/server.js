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

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// **Start API Server on 5000**
apiServer.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

// **Start Signaling Server on 5050**
signalingServer.listen(SIGNALING_PORT, () => {
  console.log(`WebRTC Signaling Server running on port ${SIGNALING_PORT}`);
});
