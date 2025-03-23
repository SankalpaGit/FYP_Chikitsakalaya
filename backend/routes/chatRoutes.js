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
      // Fetch only distinct doctors that the patient has appointments with
      const doctors = await Appointment.findAll({
        where: { patientId: req.user.id },
        include: [{ model: Doctor, attributes: ['id', 'firstName', 'lastName'] }],
        attributes: [
          [sequelize.fn('MIN', sequelize.col('id')), 'appointmentId'], // Select first appointment ID
          'doctorId'
        ],
        group: ['doctorId', 'Doctor.id', 'Doctor.firstName', 'Doctor.lastName']
      });
  
      res.json(doctors.map(a => ({
        doctorId: a.Doctor.id,
        firstName: a.Doctor.firstName,
        lastName: a.Doctor.lastName,
        appointmentId: a.getDataValue('appointmentId') // Use appointmentId for chat linkage
      })));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching doctors' });
    }
  });
  




module.exports = router;