const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware'); // Import the middleware
const { Chat, Message, Appointment, Patient, Doctor } = require('../models');

// 1. Create a new chat (Called from ChatBox.jsx or ChatBoxDoctor.jsx)
router.post('/create', verifyToken, async (req, res) => {
  const { doctorId, patientId, appointmentId } = req.body;

  try {
    // Check if there's an existing appointment between the patient and doctor
    const appointment = await Appointment.findOne({
      where: { id: appointmentId, patientId, doctorId }
    });

    if (!appointment) {
      return res.status(400).json({ success: false, message: 'Appointment not found.' });
    }

    // Create the chat
    const chat = await Chat.create({ doctorId, patientId, appointmentId });
    res.json({ success: true, chatId: chat.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 2. Get chat history (Called from ChatBox.jsx or ChatBoxDoctor.jsx)
router.get('/history/:chatId', verifyToken, async (req, res) => {
  const { chatId } = req.params;

  try {
    // Fetch the messages from the chat history
    const messages = await Message.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']],
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 3. Send a message (Called from ChatBox.jsx or ChatBoxDoctor.jsx)
router.post('/send', verifyToken, async (req, res) => {
  const { chatId, senderId, message } = req.body;

  try {
    // Save the message to the database
    const newMessage = await Message.create({
      chatId,
      senderId,
      message
    });

    // Optionally, you can also broadcast the message to the chat participants using Socket.io

    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 4. Get the list of patients or doctors with whom the user has an appointment (Used in chatHome.jsx or chatHomeDoctor.jsx)
router.get('/list', verifyToken, async (req, res) => {
  const { userId } = req.user; // Assuming the JWT token provides the userId

  try {
    // Find chats associated with the user (patient or doctor)
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { doctorId: userId }, // User is a doctor
          { patientId: userId }, // User is a patient
        ]
      },
      include: [
        { model: Doctor, attributes: ['firstName', 'lastName'] }, // Fetch doctor details for patient side
        { model: Patient, attributes: ['firstName', 'lastName'] }, // Fetch patient details for doctor side
      ]
    });

    res.json({ success: true, chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 5. Get the user (patient or doctor) details for chat (Called from chatHome.jsx or chatHomeDoctor.jsx)
router.get('/user-details', verifyToken, async (req, res) => {
  const { userId } = req.user;

  try {
    // Fetch user details from either Patient or Doctor model
    const patient = await Patient.findByPk(userId);
    const doctor = await Doctor.findByPk(userId);

    if (patient) {
      res.json({ success: true, user: patient });
    } else if (doctor) {
      res.json({ success: true, user: doctor });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;