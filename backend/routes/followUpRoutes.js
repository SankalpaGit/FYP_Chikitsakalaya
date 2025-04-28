const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Appointment, Patient, Doctor } = require('../models'); // Adjust path to your models
const FollowUp = require('../models/FollowUp');
const verifyToken = require('../middlewares/authMiddleware'); // Adjust path to your middleware

// POST 
router.post('/appointments/:appointmentId/followup', async (req, res) => {
    const { appointmentId } = req.params;
    const {
        requestedDate,
        requestedStartTime,
        requestedEndTime,
        appointmentType,
        requestDescription,
    } = req.body;

    try {
        // Validate required fields
        if (!requestedDate || !requestedStartTime || !requestedEndTime || !appointmentType) {
            return res.status(400).json({
                message: 'All required fields must be provided.',
                formMessage: 'Please fill in all required fields'
            });
        }

        // Validate appointmentType
        if (!['online', 'physical'].includes(appointmentType)) {
            return res.status(400).json({
                message: 'Invalid appointment type. Must be "online" or "physical".',
                formMessage: 'Please select a valid appointment type (online or physical)'
            });
        }

        // Check if the appointment exists
        const appointment = await Appointment.findByPk(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                message: 'Appointment not found.',
                formMessage: 'The specified appointment does not exist'
            });
        }

        // Check follow-up request count
        const followUpCount = await FollowUp.count({ where: { appointmentId } });
        if (followUpCount >= 2) {
            return res.status(400).json({
                message: 'Maximum follow-up request limit reached.',
                formMessage: 'This appointment already has the maximum of 2 follow-up requests'
            });
        }

        // Create follow-up request
        const followUp = await FollowUp.create({
            appointmentId,
            requestedDate,
            requestedStartTime,
            requestedEndTime,
            followUPType: appointmentType,
            requestDescription: requestDescription || null,
            status: 'pending',
            responseMessage: null,
        });

        return res.status(201).json({
            message: 'Follow-up request created successfully.',
            formMessage: {
                text: 'Follow-up request submitted successfully!',
                timeout: 5000 // 5 seconds timeout for the success message
            },
            data: followUp,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while creating the follow-up request.',
            formMessage: 'An error occurred. Please try again later.',
            error: error.message,
        });
    }
});

// GET for patient
router.get('/patient', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access. Token is missing.' });
    }
    let decoded;
    try {

        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    try {
        const patient = await Patient.findByPk(req.user.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }
        const followUps = await FollowUp.findAll({
            attributes: [
                'requestedDate',
                'followUPType',
                'requestedStartTime',
                'requestedEndTime',
                'requestDescription',
                'responseMessage',
                'status'
            ],
            include: [
                {
                    model: Appointment,
                    required: true,
                    attributes: ['doctorId'], // 👈 load doctorId!
                    where: { patientId: req.user.id },
                    include: [
                        {
                            model: Doctor,
                            attributes: ['firstName', 'lastName'],
                            required: true
                        }
                    ]
                }
            ]
        });

        return res.status(200).json({
            message: 'Follow-up requests retrieved successfully.',
            data: followUps,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while fetching follow-up requests.',
            error: error.message,
        });
    }
});

// GET for doctor
router.get('/doctor', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access. Token is missing.' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    try {
        const doctor = await Doctor.findByPk(req.user.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        const followUps = await FollowUp.findAll({
            attributes: [
                'id',
                'requestedDate',
                'followUPType',
                'requestedStartTime',
                'requestedEndTime',
                'requestDescription',
                'responseMessage',
                'status'
            ],
            include: [
                {
                    model: Appointment,
                    required: true,
                    attributes: ['patientId'], // Load patientId instead
                    where: { doctorId: req.user.doctorId }, // Important filtering!
                    include: [
                        {
                            model: Patient,
                            attributes: ['firstName', 'lastName'],
                            required: true
                        }
                    ]
                }
            ]
        });

        return res.status(200).json({
            message: 'Follow-up requests retrieved successfully.',
            data: followUps,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while fetching follow-up requests.',
            error: error.message,
        });
    }
});

router.post('/followups/:id/accept', async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access. Token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const followUp = await FollowUp.findByPk(id, { include: Appointment });

        if (!followUp) return res.status(404).json({ message: 'Follow-up not found.' });

        if (followUp.Appointment.doctorId !== req.user.doctorId) {
            return res.status(403).json({ message: 'You are not authorized to accept this follow-up.' });
        }


        if (!followUp) {
            return res.status(404).json({ message: 'Follow-up request not found.' });
        }

        followUp.status = 'approved';
        followUp.responseMessage = null;
        await followUp.save();

        return res.status(200).json({ message: 'Follow-up request accepted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to accept follow-up.', error: error.message });
    }
});

// Reject a follow-up
router.post('/followups/:id/reject', async (req, res) => {
    const { id } = req.params;
    const { responseMessage } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access. Token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const followUp = await FollowUp.findByPk(id, { include: Appointment });

        if (!followUp) return res.status(404).json({ message: 'Follow-up not found.' });

        if (followUp.Appointment.doctorId !== req.user.doctorId) {
            return res.status(403).json({ message: 'You are not authorized to accept this follow-up.' });
        }


        followUp.status = 'rejected';
        followUp.responseMessage = responseMessage || 'No reason provided.';
        await followUp.save();

        return res.status(200).json({ message: 'Follow-up request rejected successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to reject follow-up.', error: error.message });
    }
});

module.exports = router;