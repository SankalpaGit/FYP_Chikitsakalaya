// routes/appointmentRoutes.js

const express = require('express');
const TimeSlot = require('../models/TimeSlot')
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize'); // Import Op for Sequelize comparisons

const router = express.router();


router.post('/doctor/appointment/create', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json(
            {
                success: false,
                message: 'Invalid or expired token'
            });
    }

    try {

    } catch (err) {
        console.error(err);
        return res.status(500).json(
            {
                success: false,
                message: 'Server error: Could not create appointmenr',
                error: err.message
            });
    }
});