const express = require('express');
const jwt = require('jsonwebtoken');
const { TimeSlot, Doctor } = require('../models'); // Assuming models are in a 'models' folder
const router = express.Router();

// Add a time slot
router.post('/add/time-slot', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    const doctor = await Doctor.findByPk(req.user.doctorId);
    if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const { startTime, endTime, day } = req.body;
    if (!startTime || !endTime || !day) {
        return res.status(400).json({ success: false, message: 'Start time, end time, and day are required' });
    }

    const existingSlot = await TimeSlot.findOne({
        where: { doctorId: doctor.id, day, startTime, endTime }
    });
    if (existingSlot) {
        return res.status(400).json({ success: false, message: 'This time slot already exists' });
    }

    try {
        const newTimeSlot = await TimeSlot.create({ doctorId: doctor.id, day, startTime, endTime });
        return res.status(201).json({ success: true, message: 'Time slot added successfully', data: newTimeSlot });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error: Could not create time slot', error: err.message });
    }
});

// Get all time slots for the logged-in doctor
router.get('/show/time-slot', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    const doctor = await Doctor.findByPk(req.user.doctorId);
    if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    try {
        const timeSlots = await TimeSlot.findAll({ where: { doctorId: doctor.id } });
        return res.status(200).json({ success: true, timeSlots });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error: Could not fetch time slots', error: err.message });
    }
});

module.exports = router;
