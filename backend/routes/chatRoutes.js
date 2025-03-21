const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { Chat, Appointment, Patient, Doctor } = require('../models');
const { Op } = require('sequelize');

// 1️⃣ **Create a new chat (Called from ChatBox.jsx or ChatBoxDoctor.jsx)**
router.post('/chat/create', verifyToken, async (req, res) => {
  const { doctorId, patientId, appointmentId } = req.body;

  try {
    // Check if an appointment exists between the patient and doctor
    const appointment = await Appointment.findOne({
      where: { id: appointmentId, patientId, doctorId }
    });

    if (!appointment) {
      return res.status(400).json({ success: false, message: 'No appointment found between these users.' });
    }

    // Check if a chat already exists
    let chat = await Chat.findOne({ where: { doctorId, patientId, appointmentId } });

    if (!chat) {
      chat = await Chat.create({ doctorId, patientId, appointmentId, message: '' }); // Empty message initially
    }

    res.json({ success: true, chatId: chat.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 2️⃣ **Get chat history (Called from ChatBox.jsx or ChatBoxDoctor.jsx)**
router.get('/chat/history/:chatId', verifyToken, async (req, res) => {
  const { chatId } = req.params;

  try {
    // Fetch chat messages directly from the Chat table
    const chat = await Chat.findByPk(chatId, {
      attributes: ['id', 'doctorId', 'patientId', 'message', 'createdAt']
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 3️⃣ **Send a message (Called from ChatBox.jsx or ChatBoxDoctor.jsx)**
router.post('/chat/send', verifyToken, async (req, res) => {
  const { chatId, senderId, message } = req.body;

  try {
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    // Append the new message (assuming a simple text-based message log)
    chat.message += `\n[${new Date().toISOString()}] ${senderId}: ${message}`;
    await chat.save();

    res.json({ success: true, updatedChat: chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 4️⃣ **Get chat list (Used in chatHome.jsx or chatHomeDoctor.jsx)**
router.get('/chat/list', verifyToken, async (req, res) => {
  const { userId } = req.user;

  try {
    // Fetch all chats where the user is either the doctor or patient
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [{ doctorId: userId }, { patientId: userId }]
      },
      include: [
        { model: Doctor, attributes: ['firstName', 'lastName'] },
        { model: Patient, attributes: ['firstName', 'lastName'] }
      ]
    });

    res.json({ success: true, chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 5️⃣ **Get user details (Used in chatHome.jsx or chatHomeDoctor.jsx)**
router.get('/chat/user-details', verifyToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await Patient.findByPk(userId) || await Doctor.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;