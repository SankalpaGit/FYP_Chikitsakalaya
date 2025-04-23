const { server, io } = require('./app'); // Import server and io from app.js
const Chat = require('./models/Chat');
const Appointment = require('./models/Appointment');
const cronConfig = require('./config/cronConfig');
const { Op } = require('sequelize');

const PORT = process.env.PORT || 5000;

const activeUsers = {};
const meetingHosts = {}; // Track host per meeting
const meetingParticipants = {}; // Track all users per meeting

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('register', (userId) => {
    activeUsers[userId] = socket.id;
    socket.join(`user-${userId}`);
    console.log(`User ${userId} registered and joined user-${userId}`);
  });

  socket.on("join-room", (roomId) => {
    // Check current participants
    if (!meetingParticipants[roomId]) {
      meetingParticipants[roomId] = [];
    }

    // Limit to 2 users
    if (meetingParticipants[roomId].length >= 2) {
      socket.emit("room-full", "This meeting is limited to 2 users.");
      socket.disconnect(true);
      return;
    }

    // Add user to participants
    meetingParticipants[roomId].push(socket.id);
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);

    // Set host if first user
    if (!meetingHosts[roomId]) {
      meetingHosts[roomId] = socket.id;
      socket.emit("host-status", true);
    } else {
      socket.emit("host-status", false);
    }

    // Notify all users of participant count
    io.to(roomId).emit("participant-count", meetingParticipants[roomId].length);
  });

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  socket.on("webrtc-signal", ({ roomId, signal }) => {
    console.log(`WebRTC signal received for room ${roomId}:`, signal);
    socket.to(roomId).emit("webrtc-signal", signal);
    console.log(`WebRTC signal sent to room: ${roomId}`);
  });

  socket.on("call-end", (roomId) => {
    socket.to(roomId).emit("call-ended");
    delete meetingHosts[roomId];
    delete meetingParticipants[roomId];
    console.log(`Call ended in room: ${roomId}`);
  });

  socket.on('send-message', async ({ senderId, recipientId, message, messageType = 'text', mediaUrl }) => {
    try {
      const appointment = await Appointment.findOne({
        where: {
          [Op.or]: [
            { patientId: senderId, doctorId: recipientId },
            { patientId: recipientId, doctorId: senderId },
          ],
        },
      });

      if (!appointment) {
        socket.emit('error', { message: 'No appointment exists between sender and recipient' });
        return;
      }

      const senderType = senderId === appointment.doctorId ? 'doctor' : 'patient';
      const chatMessage = await Chat.create({
        appointmentId: appointment.id,
        senderType,
        message: messageType === 'text' ? message : null,
        messageType,
        mediaUrl: messageType !== 'text' ? mediaUrl : null,
      });

      io.to(`user-${recipientId}`).emit('newMessage', chatMessage);
      socket.emit('newMessage', chatMessage);
      console.log(`Message sent from ${senderId} to ${recipientId}:`, chatMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message', error: error.message });
    }
  });

  socket.on('get-messages', async ({ senderId, recipientId }, callback) => {
    try {
      const appointment = await Appointment.findOne({
        where: {
          [Op.or]: [
            { patientId: senderId, doctorId: recipientId },
            { patientId: recipientId, doctorId: senderId },
          ],
        },
      });

      if (!appointment) {
        console.log(`No appointment found for ${senderId} and ${recipientId}`);
        return callback([]);
      }

      const messages = await Chat.findAll({
        where: { appointmentId: appointment.id },
        order: [['createdAt', 'ASC']],
      });

      console.log(`Fetched ${messages.length} messages for ${senderId} and ${recipientId}`);
      callback(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      callback([]);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  
    // Chat logic: Remove from activeUsers
    const userId = Object.keys(activeUsers).find((key) => activeUsers[key] === socket.id);
    if (userId) {
      delete activeUsers[userId];
      console.log(`User ${userId} disconnected from activeUsers`);
    }
  
    // Video call logic: Manage meeting room
    for (const roomId in meetingParticipants) {
      const index = meetingParticipants[roomId].indexOf(socket.id);
      if (index !== -1) {
        meetingParticipants[roomId].splice(index, 1);
        if (meetingHosts[roomId] === socket.id) {
          delete meetingHosts[roomId];
          if (meetingParticipants[roomId].length > 0) {
            meetingHosts[roomId] = meetingParticipants[roomId][0]; // New host
            io.to(meetingHosts[roomId]).emit("host-status", true);
          }
        }
        io.to(roomId).emit("participant-count", meetingParticipants[roomId].length);
        if (meetingParticipants[roomId].length === 0) {
          delete meetingParticipants[roomId];
        }
      }
    }
  });
});

// Initialize Cron Jobs
cronConfig.initCrons();

server.listen(PORT, () => {
  console.log(`API and Socket.io Server running on port ${PORT}`);
});