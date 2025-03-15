const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WEBRTC_CONFIG = require("./config/webrtcConfig");

const PORT = process.env.PORT || 5000;
const SIGNALING_PORT = WEBRTC_CONFIG.SIGNALING_PORT || 5050;

const app = require("./app");
const apiServer = http.createServer(app); // API Server
const signalingServer = http.createServer(); // WebRTC + Chat Server

const io = new Server(signalingServer, {
  cors: {
    origin: WEBRTC_CONFIG.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

console.log("Allowed frontend URL:", WEBRTC_CONFIG.FRONTEND_URL);

const activeUsers = {}; // Store online users (key: userId, value: socketId)

// **WebRTC Socket Logic**
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

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

  // **Real-time Notifications**
  socket.on("send-notification", ({ recipientId, message }) => {
    const recipientSocket = activeUsers[recipientId];
    if (recipientSocket) {
      io.to(recipientSocket).emit("receive-notification", message);
    }
  });

  // **Example Appointment Notifications**
  socket.on("appointment-created", ({ doctorId, patientId, appointmentDetails }) => {
    const doctorMessage = `New appointment with ${appointmentDetails.patientName} on ${appointmentDetails.date}`;
    const patientMessage = `Your appointment with Dr. ${appointmentDetails.doctorName} is confirmed for ${appointmentDetails.date}`;

    if (activeUsers[doctorId]) {
      io.to(activeUsers[doctorId]).emit("receive-notification", doctorMessage);
    }
    if (activeUsers[patientId]) {
      io.to(activeUsers[patientId]).emit("receive-notification", patientMessage);
    }
  });

  socket.on("appointment-reminder", ({ doctorId, patientId, appointmentDetails }) => {
    const doctorMessage = `Reminder: You have an appointment with ${appointmentDetails.patientName} in 24 hours`;
    const patientMessage = `Reminder: Your appointment with Dr. ${appointmentDetails.doctorName} is in 24 hours`;

    if (activeUsers[doctorId]) {
      io.to(activeUsers[doctorId]).emit("receive-notification", doctorMessage);
    }
    if (activeUsers[patientId]) {
      io.to(activeUsers[patientId]).emit("receive-notification", patientMessage);
    }
  });

  // **One-to-One Chat**
  socket.on("send-message", ({ senderId, recipientId, message }) => {
    const recipientSocket = activeUsers[recipientId];
    if (recipientSocket) {
      io.to(recipientSocket).emit("receive-message", { senderId, message });
    }
  });

  // **User Disconnect Handling**
  socket.on("disconnect", () => {
    const userId = Object.keys(activeUsers).find((key) => activeUsers[key] === socket.id);
    if (userId) {
      delete activeUsers[userId];
      console.log(`User ${userId} disconnected`);
    }
  });
});

// **Express API Server on 5000**
apiServer.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

// **Socket Server on 5050**
signalingServer.listen(SIGNALING_PORT, () => {
  console.log(`WebRTC & Chat Server running on port ${SIGNALING_PORT}`);
});
