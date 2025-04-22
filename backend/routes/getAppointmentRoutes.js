// routes/getAppointmentRoutes.js 
const express = require('express');
const jwt = require('jsonwebtoken');
const { Doctor, Patient, DoctorDetail } = require('../models');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const router = express.Router();

// Route to view appointments for both patients and doctors
// This route will be used to fetch appointments for both patients and doctors
// routes/getAppointmentRoutes.js
router.get('/view/appointments', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  let decoded;
  try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
  } catch (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }

  // Only allow doctor access
  const doctor = await Doctor.findByPk(decoded.doctorId);
  if (!doctor) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Not a doctor' });
  }

  try {
      const appointments = await Appointment.findAll({
          where: {
              doctorId: decoded.doctorId,
              isComplete: false,
              isCancelled: false
          },
          attributes: ['id', 'date', 'StartTime', 'EndTime', 'appointmentType', 'description'],
          include: [
              {
                  model: Payment,
                  attributes: ['paymentStatus']
              },
              {
                  model: Patient,
                  attributes: ['firstName', 'lastName']
              }
          ],
          order: [['date', 'ASC'], ['StartTime', 'ASC']]
      });

      return res.status(200).json({ success: true, appointments });
  } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/view/appointments/patient', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  let decoded;
  try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
  } catch (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }

  const patient = await Patient.findByPk(decoded.id);
  if (!patient) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Not a patient' });
  }

  try {
      const appointments = await Appointment.findAll({
          where: {
              patientId: decoded.id,
              isComplete: false,
              isCancelled: false
          },
          attributes: ['id', 'date', 'StartTime', 'EndTime', 'appointmentType', 'description', 'hospitalAffiliation'],
          include: [
              {
                  model: Payment,
                  attributes: ['paymentStatus']
              },
              {
                  model: Doctor,
                  attributes: ['firstName', 'lastName'],
                  include: [{
                      model: DoctorDetail,
                      as: 'doctorDetails',
                      attributes: ['speciality', 'profilePicture']
                  }]
              }
          ],
          order: [['date', 'ASC'], ['StartTime', 'ASC']]
      });

      return res.status(200).json({ success: true, appointments });
  } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error' });
  }
});


// route for completed appointments
router.get('/view/appointments/completed', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token' });
  
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
  
    let role;
    let user;
  
    const patient = await Patient.findByPk(decoded.id);
    if (patient) {
      role = 'patient';
      user = patient;
    }
  
    const doctor = await Doctor.findByPk(decoded.doctorId);
    if (doctor) {
      role = 'doctor';
      user = doctor;
    }
  
    if (!role) return res.status(403).json({ success: false, message: 'Unauthorized role' });
  
    try {
      let filter = { isComplete: true };
      let include = [];
  
      if (role === 'doctor') {
        filter.doctorId = decoded.doctorId;
        include.push({
          model: Patient,
          attributes: ['firstName', 'lastName']
        });
      } else if (role === 'patient') {
        filter.patientId = decoded.id;
        include.push({
          model: Doctor,
          attributes: ['firstName', 'lastName'],
          include: [{
            model: DoctorDetail,
            as: 'doctorDetails',
            attributes: ['speciality', 'hospitalAffiliation', 'profilePicture']
          }]
        });
      }
  
      const appointments = await Appointment.findAll({
        where: filter,
        attributes: ['id', 'date', 'StartTime', 'EndTime', 'appointmentType', 'description', 'isComplete'],
        include,
        order: [['date', 'ASC'], ['StartTime', 'ASC']]
      });
  
      return res.status(200).json({ success: true, appointments });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  

module.exports = router;
