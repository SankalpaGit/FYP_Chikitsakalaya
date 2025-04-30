const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Route: GET /api/doctor/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctorId = decoded.doctorId;

    // Fetch Doctor Info
    const doctor = await Doctor.findByPk(doctorId, {
      attributes: ['firstName', 'lastName']
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Total Appointments (excluding cancelled)
    const totalAppointments = await Appointment.count({
      where: { doctorId, isCancelled: false },
    });

    // Completed Appointments
    const completedAppointments = await Appointment.count({
      where: { doctorId, isComplete: true, isCancelled: false },
    });

    // Remaining Appointments
    const remainingAppointments = await Appointment.count({
      where: { doctorId, isComplete: false, isCancelled: false },
    });

    // Unique Patients Checked
    const uniquePatientsChecked = await Appointment.count({
      where: { doctorId, isComplete: true, isCancelled: false },
      distinct: true,
      col: 'patientId',
    });

    res.json({
      doctorName: `${doctor.firstName} ${doctor.lastName}`,
      totalAppointments,
      completedAppointments,
      remainingAppointments,
      uniquePatientsChecked,
    });

  } catch (error) {
    console.error('Error fetching doctor dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
