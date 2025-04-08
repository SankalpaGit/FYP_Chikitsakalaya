const express = require("express");
const  Appointment  = require("../models/Appointment"); // Import Appointment model
const { Patient, Doctor } = require("../models"); // Import Doctor model
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize"); // Import Op for Sequelize comparisons
const router = express.Router(); 

router.post("/doctor/appointment/create", async (req, res) => {
    // 🔐 Extract Token from Headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user to request
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    // 🏥 Verify Patient
    const patient = await Patient.findByPk(decoded.id);
    if (!patient) {
        return res.status(404).json({ success: false, message: "Patient not found" });
    }

    try {
        // Extract Data from Request
        const { doctorId, date, StartTime, EndTime, appointmentType, description } = req.body;
        const patientId = req.user.id; // Extracted from token

        // Validate Required Fields
        if (!doctorId || !date || !StartTime || !EndTime || !appointmentType || !description) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Check if Doctor Exists
        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found." });
        }

        // Check if Appointment Slot is Already Taken
        const existingAppointment = await Appointment.findOne({
            where: {
                doctorId,
                date,
                [Op.or]: [
                    {
                        [Op.and]: [
                            { StartTime: { [Op.lte]: EndTime } },
                            { EndTime: { [Op.gte]: StartTime } }
                        ]
                    }
                ]
            }
        });
        

        if (existingAppointment) {
            return res.status(409).json({ success: false, message: "Time slot already booked." });
        }

        //  Create the Appointment
        const newAppointment = await Appointment.create({
            doctorId,
            patientId,
            date,
            StartTime,
            EndTime,
            appointmentType,
            description
        });

        return res.status(201).json({ success: true, message: "Appointment booked successfully.", appointment: newAppointment });

    } catch (err) {
        console.error("Server Error:", err);
        console.error("Error Details:", err.message);
        return res.status(500).json({ success: false, message: "Server error: Could not create appointment", error: err.message });
    }
});

module.exports = router;
