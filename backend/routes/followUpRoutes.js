const express = require("express");
const { Appointment, Patient, Doctor, TimeSlot, Notification, DoctorDetail} = require("../models");
const FollowUp = require("../models/FollowUp");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createMeetingLink } = require('../controllers/createMeetingLinkController');
const router = express.Router();

// Helper function from your original code
const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:${minute} ${ampm}`;
};

// Patient: Request a follow-up
router.post("/appointments/:id/followup", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    const transaction = await sequelize.transaction();

    try {
        const { requestedDate, requestedStartTime, requestedEndTime, appointmentType, hospitalAffiliation, requestDescription } = req.body;

        // Validate required fields
        if (!requestedDate || !requestedStartTime || !requestedEndTime || !appointmentType) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Date, start time, end time, and appointment type are required" });
        }

        if (!['online', 'physical'].includes(appointmentType)) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Invalid appointment type" });
        }

        if (appointmentType === 'physical' && !hospitalAffiliation) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Hospital affiliation is required for physical appointments" });
        }

        // Validate date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const followUpDate = new Date(requestedDate);
        if (followUpDate < today) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Cannot request follow-up for past dates" });
        }

        // Find the appointment
        const appointment = await Appointment.findOne({
            where: { id: req.params.id, patientId: decoded.id },
            include: [
                { 
                    model: Doctor, 
                    as: 'doctor', 
                    include: [{ model: DoctorDetail, as: 'doctorDetails', attributes: ['consultationFee'] }] 
                }
            ],
        });

        if (!appointment) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "Appointment not found or not authorized" });
        }

        // Check if appointment is completed
        const appointmentDate = new Date(appointment.date);
        if (appointmentDate >= today) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Follow-up can only be requested for completed appointments" });
        }

        // Check follow-up limit
        const followUpCount = await FollowUp.count({
            where: { appointmentId: req.params.id, status: 'approved' },
        });

        if (followUpCount >= 2) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Maximum of two follow-ups reached for this appointment" });
        }

        // Validate time slot
        const dayOfWeek = followUpDate.toLocaleDateString('en-US', { weekday: 'long' });
        const timeSlot = await TimeSlot.findOne({
            where: {
                doctorId: appointment.doctorId,
                day: dayOfWeek,
                startTime: requestedStartTime,
                endTime: requestedEndTime,
                appointmentType,
                hospitalAffiliation: appointmentType === 'physical' ? hospitalAffiliation : null,
            },
        });

        if (!timeSlot) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Selected time slot is not available" });
        }

        // Create follow-up request
        const followUp = await FollowUp.create({
            appointmentId: req.params.id,
            status: 'pending',
            requestDescription,
            requestedDate,
            requestedStartTime,
            requestedEndTime,
            appointmentType,
            hospitalAffiliation: appointmentType === 'physical' ? hospitalAffiliation : null,
        }, { transaction });

        // Notify patient
        await Notification.create({
            patientId: decoded.id,
            appointmentId: req.params.id,
            message: `Your follow-up request for ${followUpDate.toLocaleDateString()} from ${formatTime(requestedStartTime)} to ${formatTime(requestedEndTime)} has been sent.`,
            type: 'followup_request',
            isRead: false,
        }, { transaction });

        // Notify doctor (assuming Notification model supports doctorId)
        await Notification.create({
            patientId: null,
            doctorId: appointment.doctorId,
            appointmentId: req.params.id,
            message: `New follow-up request from patient for ${followUpDate.toLocaleDateString()} from ${formatTime(requestedStartTime)} to ${formatTime(requestedEndTime)}.`,
            type: 'followup_request',
            isRead: false,
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Follow-up request sent successfully",
            followUp,
        });
    } catch (err) {
        console.error("Server Error:", err);
        await transaction.rollback();
        return res.status(500).json({
            success: false,
            message: "Server error: Could not create follow-up request",
            error: err.message,
        });
    }
});

// Doctor: Approve or reject follow-up
router.patch("/followups/:id/status", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    const transaction = await sequelize.transaction();

    try {
        const { status, responseMessage } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Status must be 'approved' or 'rejected'" });
        }

        // Find the follow-up request
        const followUp = await FollowUp.findOne({
            where: { id: req.params.id },
            include: [
                { 
                    model: Appointment, 
                    as: 'appointment', 
                    include: [
                        { 
                            model: Doctor, 
                            as: 'doctor', 
                            include: [{ model: DoctorDetail, as: 'doctorDetails', attributes: ['consultationFee'] }] 
                        },
                        { model: Patient, as: 'patient' }
                    ] 
                },
            ],
        });

        if (!followUp) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "Follow-up request not found" });
        }

        // Verify doctor
        if (followUp.appointment.doctorId !== decoded.id) {
            await transaction.rollback();
            return res.status(403).json({ success: false, message: "Not authorized to manage this follow-up" });
        }

        if (followUp.status !== 'pending') {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Follow-up request is no longer pending" });
        }

        followUp.status = status;
        followUp.responseMessage = responseMessage || null;
        await followUp.save({ transaction });

        if (status === 'rejected') {
            // Notify patient
            await Notification.create({
                patientId: followUp.appointment.patientId,
                appointmentId: followUp.appointmentId,
                message: `Your follow-up request for ${new Date(followUp.requestedDate).toLocaleDateString()} was rejected. ${responseMessage || ''}`,
                type: 'followup_rejected',
                isRead: false,
            }, { transaction });

            await transaction.commit();
            return res.status(200).json({
                success: true,
                message: "Follow-up request rejected",
                followUp,
            });
        }

        // For approved follow-ups, create a new appointment
        const doctorDetail = followUp.appointment.doctor.doctorDetails?.[0];
        const consultationFee = doctorDetail?.consultationFee;

        if (!doctorDetail || consultationFee == null || isNaN(consultationFee) || consultationFee < 0) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Valid consultation fee not available" });
        }

        // Check for conflicting appointments
        const conflictingAppointment = await Appointment.findOne({
            where: {
                doctorId: followUp.appointment.doctorId,
                date: followUp.requestedDate,
                [Op.or]: [
                    {
                        [Op.and]: [
                            { StartTime: { [Op.lte]: followUp.requestedEndTime } },
                            { EndTime: { [Op.gte]: followUp.requestedStartTime } },
                        ],
                    },
                ],
            },
        });

        if (conflictingAppointment) {
            await transaction.rollback();
            return res.status(409).json({ success: false, message: "Time slot already booked" });
        }

        // Create new appointment
        const newAppointment = await Appointment.create({
            doctorId: followUp.appointment.doctorId,
            patientId: followUp.appointment.patientId,
            date: followUp.requestedDate,
            StartTime: followUp.requestedStartTime,
            EndTime: followUp.requestedEndTime,
            appointmentType: followUp.appointmentType,
            description: followUp.requestDescription || 'Follow-up appointment',
            hospitalAffiliation: followUp.hospitalAffiliation,
        }, { transaction });

        // Create meeting link for online appointments
        if (followUp.appointmentType === 'online') {
            const meetingResult = await createMeetingLink(newAppointment, transaction);
            if (!meetingResult.success) {
                await transaction.rollback();
                return res.status(500).json({
                    success: false,
                    message: "Failed to create meeting link",
                    error: meetingResult.message,
                });
            }
        }

        // Notify patient (payment required)
        await Notification.create({
            patientId: followUp.appointment.patientId,
            appointmentId: newAppointment.id,
            message: `Your follow-up request for ${new Date(followUp.requestedDate).toLocaleDateString()} from ${formatTime(followUp.requestedStartTime)} to ${formatTime(followUp.requestedEndTime)} was approved. Please complete the payment to confirm.`,
            type: 'followup_approved',
            isRead: false,
        }, { transaction });

        await transaction.commit();

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(consultationFee * 100),
            currency: 'usd',
            metadata: {
                doctorId: followUp.appointment.doctorId,
                patientId: followUp.appointment.patientId,
                date: followUp.requestedDate,
                StartTime: followUp.requestedStartTime,
                EndTime: followUp.requestedEndTime,
                appointmentType: followUp.appointmentType,
                description: followUp.requestDescription || '',
                hospitalAffiliation: followUp.hospitalAffiliation || '',
                consultationFee: consultationFee.toString(),
                appointmentId: newAppointment.id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Follow-up request approved, payment required",
            followUp,
            newAppointment,
            clientSecret: paymentIntent.client_secret,
            amount: consultationFee,
            paymentIntentId: paymentIntent.id,
        });
    } catch (err) {
        console.error("Server Error:", err);
        await transaction.rollback();
        return res.status(500).json({
            success: false,
            message: "Server error: Could not update follow-up status",
            error: err.message,
        });
    }
});

// Get count of approved follow-ups for an appointment
router.get("/appointments/:id/followups/count", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    try {
        // Verify the appointment belongs to the patient
        const appointment = await Appointment.findOne({
            where: { id: req.params.id, patientId: decoded.id },
        });

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found or not authorized" });
        }

        // Count approved follow-ups
        const followUpCount = await FollowUp.count({
            where: { appointmentId: req.params.id, status: 'approved' },
        });

        return res.status(200).json({
            success: true,
            count: followUpCount,
        });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error: Could not fetch follow-up count",
            error: err.message,
        });
    }
});

module.exports = router;