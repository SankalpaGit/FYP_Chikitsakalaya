const express = require("express");
const { Appointment, Patient, Doctor, TimeSlot, Notification } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const router = express.Router();

router.post("/doctor/appointment/create", async (req, res) => {
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

    const patient = await Patient.findByPk(decoded.id);
    if (!patient) {
        return res.status(404).json({ success: false, message: "Patient not found" });
    }

    try {
        const { doctorId, date, StartTime, EndTime, appointmentType, description, hospitalAffiliation } = req.body;
        const patientId = req.user.id;

        if (!doctorId || !date || !StartTime || !EndTime || !appointmentType || !description) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (!['online', 'physical'].includes(appointmentType)) {
            return res.status(400).json({ success: false, message: "Invalid appointment type" });
        }

        if (appointmentType === 'physical' && !hospitalAffiliation) {
            return res.status(400).json({
                success: false,
                message: "Hospital affiliation is required for physical appointments",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentDate = new Date(date);
        if (appointmentDate < today) {
            return res.status(400).json({
                success: false,
                message: "Cannot book appointments for past dates",
            });
        }

        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        const timeSlot = await TimeSlot.findOne({
            where: {
                doctorId,
                day: dayOfWeek,
                startTime: StartTime,
                endTime: EndTime,
                appointmentType,
                hospitalAffiliation: appointmentType === 'physical' ? hospitalAffiliation : null,
            },
        });

        if (!timeSlot) {
            return res.status(400).json({
                success: false,
                message: "Selected time slot is not available",
            });
        }

        const existingAppointment = await Appointment.findOne({
            where: {
                doctorId,
                date,
                [Op.or]: [
                    {
                        [Op.and]: [
                            { StartTime: { [Op.lte]: EndTime } },
                            { EndTime: { [Op.gte]: StartTime } },
                        ],
                    },
                ],
            },
        });

        if (existingAppointment) {
            return res.status(409).json({ success: false, message: "Time slot already booked" });
        }

        const newAppointment = await Appointment.create({
            doctorId,
            patientId,
            date,
            StartTime,
            EndTime,
            appointmentType,
            description,
            hospitalAffiliation: appointmentType === 'physical' ? hospitalAffiliation : null,
            isComplete: false,
            isCancelled: false,
        });

        await Notification.create({
            patientId,
            appointmentId: newAppointment.id,
            message: `Appointment confirmed for ${new Date(date).toLocaleDateString()} at ${formatTime(StartTime)} ${appointmentType === 'physical' ? `at ${hospitalAffiliation}` : ''}`,
            type: 'confirmation',
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment: newAppointment,
        });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error: Could not create appointment",
            error: err.message,
        });
    }
});

router.get("/notifications", async (req, res) => {
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
        const patient = await Patient.findByPk(decoded.id);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        const notifications = await Notification.findAll({
            where: { patientId: decoded.id },
            order: [['createdAt', 'DESC']],
            include: [
                { model: Appointment, as: 'appointment', attributes: ['id', 'date', 'StartTime', 'appointmentType', 'hospitalAffiliation'] },
            ],
        });

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error: Could not fetch notifications",
            error: err.message,
        });
    }
});

router.patch("/notifications/:id/read", async (req, res) => {
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
        const notification = await Notification.findOne({
            where: { id: req.params.id, patientId: decoded.id },
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({ success: true, message: "Notification marked as read" });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error: Could not mark notification as read",
            error: err.message,
        });
    }
});

const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:${minute} ${ampm}`;
};

module.exports = router;