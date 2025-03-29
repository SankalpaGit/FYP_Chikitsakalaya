const { server, io } = require('./app'); // Import server and io from app.js
const Chat = require('./models/Chat');
const Appointment = require('./models/Appointment');
const { Op } = require('sequelize');

const PORT = process.env.PORT || 5000;

const activeUsers = {};

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('register', (userId) => {
    activeUsers[userId] = socket.id;
    socket.join(`user-${userId}`);
    console.log(`User ${userId} registered and joined user-${userId}`);
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
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

  socket.on('disconnect', () => {
    const userId = Object.keys(activeUsers).find((key) => activeUsers[key] === socket.id);
    if (userId) {
      delete activeUsers[userId];
      console.log(`User ${userId} disconnected`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`API and Socket.io Server running on port ${PORT}`);
});