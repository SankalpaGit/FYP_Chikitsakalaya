const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Chat = require('../models/Chat');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

router.get('/chat/doctor/patients', verifyToken, async (req, res) => {
  try {
    if (!req.user.doctorId) {
      return res.status(400).json({ success: false, message: 'Doctor ID not found in token' });
    }

    const doctorId = req.user.doctorId;
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointments = await Appointment.findAll({
      where: { doctorId },
      include: [{ model: Patient, attributes: ['id', 'firstName', 'lastName'] }],
    });

    if (!appointments.length) {
      return res.status(404).json({ success: false, message: 'No patients found' });
    }

    const patients = [...new Map(appointments.map(a => [
      a.Patient.id,
      { patientId: a.Patient.id, firstName: a.Patient.firstName, lastName: a.Patient.lastName }
    ])).values()];

    console.log('Patients fetched:', patients);
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/chat/doctor/send', verifyToken, async (req, res) => {
  try {
    const { patientId, message, messageType = 'text', mediaUrl } = req.body;

    if (!req.user.doctorId || !patientId || (!message && !mediaUrl)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const appointment = await Appointment.findOne({
      where: { doctorId: req.user.doctorId, patientId },
    });
    if (!appointment) return res.status(404).json({ message: 'No appointment exists' });

    const chatMessage = await Chat.create({
      appointmentId: appointment.id,
      senderType: 'doctor',
      message: messageType === 'text' ? message : null,
      messageType,
      mediaUrl: messageType !== 'text' ? mediaUrl : null,
    });

    if (req.io) {
      req.io.to(`user-${patientId}`).emit('newMessage', chatMessage);
      req.io.to(`user-${req.user.doctorId}`).emit('newMessage', chatMessage);
      console.log(`Message emitted to user-${patientId} and user-${req.user.doctorId}`);
    } else {
      console.warn('⚠️ Socket.io instance (req.io) not available');
    }

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error('Error sending doctor message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/chat/doctor/history/:patientId', verifyToken, async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!req.user.doctorId) {
      return res.status(400).json({ message: 'Doctor ID not found' });
    }

    const appointment = await Appointment.findOne({
      where: { doctorId: req.user.doctorId, patientId },
    });
    if (!appointment) return res.status(404).json({ message: 'No appointment exists' });

    const messages = await Chat.findAll({
      where: { appointmentId: appointment.id },
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching doctor history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Patient routes remain unchanged for now
router.get('/chat/patient/doctors', verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.user.id },
      include: [{ model: Doctor, attributes: ['id', 'firstName', 'lastName'] }],
    });

    if (!appointments.length) return res.status(404).json({ message: 'No doctors found' });

    const doctors = [...new Map(appointments.map(a => [
      a.Doctor.id,
      { doctorId: a.Doctor.id, firstName: a.Doctor.firstName, lastName: a.Doctor.lastName }
    ])).values()];

    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/chat/patient/send', verifyToken, async (req, res) => {
  try {
    const { doctorId, message, messageType = 'text', mediaUrl } = req.body;

    if (!req.user.id || !doctorId || (!message && !mediaUrl)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const appointment = await Appointment.findOne({
      where: { patientId: req.user.id, doctorId },
    });
    if (!appointment) return res.status(404).json({ message: 'No appointment exists' });

    const chatMessage = await Chat.create({
      appointmentId: appointment.id,
      senderType: 'patient',
      message: messageType === 'text' ? message : null,
      messageType,
      mediaUrl: messageType !== 'text' ? mediaUrl : null,
    });

    if (req.io) {
      req.io.to(`user-${doctorId}`).emit('newMessage', chatMessage);
      req.io.to(`user-${req.user.id}`).emit('newMessage', chatMessage);
      console.log(`Message emitted to user-${doctorId} and user-${req.user.id}`);
    } else {
      console.warn('⚠️ Socket.io instance (req.io) not available');
    }

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error('Error sending patient message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/chat/patient/history/:doctorId', verifyToken, async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointment = await Appointment.findOne({
      where: { patientId: req.user.id, doctorId },
    });
    if (!appointment) return res.status(404).json({ message: 'No appointment exists' });

    const messages = await Chat.findAll({
      where: { appointmentId: appointment.id },
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching patient history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;