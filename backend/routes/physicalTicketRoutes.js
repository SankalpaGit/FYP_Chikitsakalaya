const express = require('express');
const jwt = require('jsonwebtoken');
const PhysicalTicket = require('../models/PhysicalTicket');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

const router = express.Router();

// Route to fetch the logged-in patient's physical ticket
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

        // Fetch the authenticated patient
        const patient = await Patient.findByPk(decoded.id);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        // Find the patient's appointment with a physical ticket
        const appointment = await Appointment.findOne({
            where: { patientId: patient.id },
            include: [{ model: PhysicalTicket }],
        });

        if (!appointment || !appointment.PhysicalTicket) {
            return res.status(404).json({ success: false, message: 'No ticket found' });
        }

        // Return the ticket details
        res.json({ success: true, ticket: appointment.PhysicalTicket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
