const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Chat= require('../models/Chat');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const sequelize = require('../config/database');

const { Op } = require('sequelize');

router.get('/chat/doctors', verifyToken, async (req, res) => {
  try {
    console.log("🔹 User from token:", req.user); // Debugging
    console.log("🔹 Requested chat with:", req.params.recipientId);

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    const appointments = await Appointment.findAll({
      where: { patientId: req.user.id },
      include: [{ model: Doctor, attributes: ['id', 'firstName', 'lastName'] }],
    });

    console.log("Appointments found:", appointments); // Debugging

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    // Extract unique doctors
    const uniqueDoctors = {};
    appointments.forEach((a) => {
      if (!uniqueDoctors[a.Doctor.id]) {
        uniqueDoctors[a.Doctor.id] = {
          doctorId: a.Doctor.id,
          firstName: a.Doctor.firstName,
          lastName: a.Doctor.lastName,
        };
      }
    });

    console.log("Unique doctors list:", Object.values(uniqueDoctors)); // Debugging

    return res.json(Object.values(uniqueDoctors));
  } catch (error) {
    console.error("Error fetching doctors:", error); // Log actual error details
    return res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

router.get('/chat/patients', verifyToken, async (req, res) => {
  try {
    console.log("Decoded user in verifyToken middleware:", req.user);
    console.log("Doctor ID extracted:", req.user.doctorId); // Debugging

    if (!req.user || !req.user.doctorId) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    const appointments = await Appointment.findAll({
      where: { doctorId: req.user.doctorId }, // Corrected
      include: [{ model: Patient, attributes: ['id', 'firstName', 'lastName'] }],
    });

    console.log("Appointments found:", appointments);

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    const uniquePatients = {};
    appointments.forEach((a) => {
      if (!uniquePatients[a.Patient.id]) {
        uniquePatients[a.Patient.id] = {
          patientId: a.Patient.id,
          firstName: a.Patient.firstName,
          lastName: a.Patient.lastName,
        };
      }
    });

    return res.json(Object.values(uniquePatients));
  } catch (error) {
    console.error("Error fetching patients:", error);
    return res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});


router.post('/chat/send', verifyToken, async (req, res) => {
  try {
    const { recipientId, message } = req.body;

    if (!req.user || !req.user.id || !recipientId || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("🔹 Sending message from:", req.user.id, "to:", recipientId);

    // Ensure the appointment exists between the user (doctor or patient) and the recipient
    const appointment = await Appointment.findOne({
      where: {
        [Op.or]: [
          { patientId: req.user.id, doctorId: recipientId },
          { patientId: recipientId, doctorId: req.user.id }
        ]
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: "No appointment found for this chat" });
    }

    console.log("✅ Found appointment:", appointment.id);

    const senderType = req.user.id === appointment.doctorId ? "doctor" : "patient";

    const newMessage = await Chat.create({
      appointmentId: appointment.id,
      senderType,
      message,
    });

    console.log("✅ Message sent:", newMessage.message);

    // Handle Socket.io emit safely
    try {
      if (req.io) {
        req.io.to(`user-${recipientId}`).emit('newMessage', newMessage);
      } else {
        console.warn("⚠️ Socket.io instance not found. Message will be available on refresh.");
      }
    } catch (emitError) {
      console.error("⚠️ Socket.io Emit Error:", emitError);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(" Error sending message:", error);
    return res.status(500).json({ message: "Error sending message", error: error.message });
  }
});

router.get('/chat/history/:recipientId', verifyToken, async (req, res) => {
  try {
    const { recipientId } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid user" });
    }

    console.log("🔹 Fetching chat history for user:", req.user.id, "with recipient:", recipientId);

    // Find the appointment where the patient and doctor are involved
    const appointment = await Appointment.findOne({
      where: {
        [Op.or]: [
          { patientId: req.user.id, doctorId: recipientId },
          { patientId: recipientId, doctorId: req.user.id }
        ]
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: "No appointment found for this chat" });
    }

    console.log("✅ Found appointment:", appointment.id);

    // Fetch chat messages linked to this appointment
    const messages = await Chat.findAll({
      where: { appointmentId: appointment.id },
      order: [["createdAt", "ASC"]], // Order messages by creation time
    });

    console.log("✅ Chat history found:", messages.length, "messages");

    return res.json(messages);
  } catch (error) {
    console.error("🔴 Error fetching chat history:", error);
    return res.status(500).json({ message: "Error fetching chat history", error: error.message });
  }
});


module.exports = router;