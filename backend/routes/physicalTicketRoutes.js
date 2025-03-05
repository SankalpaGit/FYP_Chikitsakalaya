const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const PhysicalTicket = require('../models/PhysicalTicket');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

const router = express.Router();

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

        // Fetch the patient
        const patient = await Patient.findByPk(decoded.id);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // Fetch appointment and physical ticket
        const ticket = await PhysicalTicket.findOne({
            include: [
                {
                    model: Appointment,
                    where: { patientId: patient.id }, // Ensuring the appointment belongs to the patient
                    include: [{ model: Patient }]
                }
            ]
        });

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'No ticket found' });
        }

        // Return the ticket details
        res.json({ success: true, ticket });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
