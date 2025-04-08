const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const PhysicalTicket = require('../models/PhysicalTicket');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

const router = express.Router();

// routes to get physical tickets and display them to the patient
router.get('/appointment/ticket', async (req, res) => {
    try {
        // Extract token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        // Verify the JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }

        // Fetch the physical tickets linked to the logged-in patient
        const tickets = await PhysicalTicket.findAll({
            attributes: ['id', 'pdfLink', 'tokenNumber'], // Select specific fields
            include: [
                {
                    model: Appointment,
                    attributes: [], // We don't need appointment fields
                    where: { patientId: decoded.id }, // Ensure the appointment belongs to the logged-in patient
                }
            ]
        });

        if (!tickets.length) {
            return res.status(404).json({ success: false, message: 'No ticket found' });
        }

        // Return the ticket details
        res.json({ success: true, tickets });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


module.exports = router;
