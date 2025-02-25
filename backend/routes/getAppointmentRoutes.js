// routes/getAppointmentRoutes.js 

const express = require('express');
const jwt = require('jsonwebtoken');
const { Doctor, Patient } = require('../models');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const router = express.Router();

router.get('/view/appointments', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user to request
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    let role;
    let user;

    // Fetch Patient and Doctor data based on the decoded user ID
    const patient = await Patient.findByPk(decoded.id);
    if (patient) {
        role = 'patient';
        user = patient;
    }

    const doctor = await Doctor.findByPk(decoded.id);
    if (doctor) {
        role = 'doctor';
        user = doctor;
    }

    if (!role) {
        return res.status(403).json({ success: false, message: 'Unauthorized role' });
    }

    try {
        let filter = {};
        let include = [
            { model: Payment, attributes: ['paymentStatus'] }
        ];

        // Use the correct role for filtering
        if (role === 'doctor') {
            filter.doctorId = decoded.id;
            include.push({ model: Patient, attributes: ['firstName', 'lastName'] });
        } else if (role === 'patient') {
            filter.patientId = decoded.id;
            include.push({ model: Doctor, attributes: ['firstName', 'lastName'] });
        } else {
            return res.status(403).json({ success: false, message: 'Unauthorized role' });
        }

        // Fetch appointments based on role
        const appointments = await Appointment.findAll({
            where: filter,
            attributes: ['date', 'StartTime', 'EndTime', 'appointmentType', 'description'],
            include,
            order: [['date', 'ASC'], ['StartTime', 'ASC']]
        });

        return res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});


// route used in admin pages
router.get('/admin/appointments', async (req, res) => {

    try {
        const appointments = await Appointment.findAll({
            attributes: ['date', 'StartTime', 'EndTime', 'appointmentType', 'description'],
            include: [
                { model: Doctor, attributes: ['firstName', 'lastName'] },
                { model: Patient, attributes: ['firstName', 'lastName'] },
                { model: Payment, attributes: ['paymentStatus'] }
            ],
            order: [['date', 'ASC'], ['StartTime', 'ASC']]
        });

        return res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});



module.exports = router;
