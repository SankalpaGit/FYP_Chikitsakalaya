const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize'); // Import Op for Sequelize comparisons
const { TimeSlot, Doctor } = require('../models'); // Assuming models are in a 'models' folder
const router = express.Router();


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
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const timeSlots = req.body; // Expecting an array of time slots
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid time slot data' });
    }

    try {
        const newTimeSlots = [];
        for (const slot of timeSlots) {
            const { day, startTime, endTime, appointmentType, hospitalAffiliation } = slot;
            // Validate required fields
            if (!day || !startTime || !endTime || !appointmentType) {
                return res.status(400).json({
                    success: false,
                    message: 'Each time slot must have a day, startTime, endTime, and appointmentType',
                });
            }
            if (!['online', 'physical'].includes(appointmentType)) {
                return res.status(400).json({ success: false, message: 'Invalid appointment type' });
            }
            // Require hospitalAffiliation for physical appointments
            if (appointmentType === 'physical' && !hospitalAffiliation) {
                return res.status(400).json({
                    success: false,
                    message: 'Hospital affiliation is required for physical appointments',
                });
            }

            // Check for conflicting time slots
            const conflictingSlot = await TimeSlot.findOne({
                where: {
                    doctorId: doctor.id,
                    day,
                    appointmentType,
                    [Op.or]: [
                        { startTime: { [Op.between]: [startTime, endTime] } },
                        { endTime: { [Op.between]: [startTime, endTime] } },
                        {
                            [Op.and]: [
                                { startTime: { [Op.lte]: startTime } },
                                { endTime: { [Op.gte]: endTime } },
                            ],
                        },
                    ],
                },
            });

            if (conflictingSlot) {
                return res.status(400).json({
                    success: false,
                    message: 'Time slot conflicts with an existing slot',
                });
            }

            const newSlot = await TimeSlot.create({
                doctorId: doctor.id,
                day,
                startTime,
                endTime,
                appointmentType,
                hospitalAffiliation: appointmentType === 'physical' ? hospitalAffiliation : null, // Set to null for online appointments
            });
            newTimeSlots.push(newSlot);
        }

        return res.status(201).json({
            success: true,
            message: 'Time slots added successfully',
            data: newTimeSlots,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error: Could not create time slots',
            error: err.message,
        });
    }
});


const convertTo24HourFormat = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
        hours = String(Number(hours) + 12);
    } else if (modifier === 'AM' && hours === '12') {
        hours = '00';
    }

    return `${hours}:${minutes}:00`; // MySQL expects HH:MM:SS format
};

router.delete('/remove/time-slot', async (req, res) => {
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
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const { day, startTime, endTime, appointmentType, hospitalAffiliation } = req.body;
    if (!day || !startTime || !endTime || !appointmentType) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields (day, startTime, endTime, appointmentType)',
        });
    }
    if (!['online', 'physical'].includes(appointmentType)) {
        return res.status(400).json({ success: false, message: 'Invalid appointment type' });
    }
    // Require hospitalAffiliation for physical appointments
    if (appointmentType === 'physical' && !hospitalAffiliation) {
        return res.status(400).json({
            success: false,
            message: 'Hospital affiliation is required for physical appointments',
        });
    }

    // Convert to 24-hour format for MySQL
    const formattedStartTime = convertTo24HourFormat(startTime);
    const formattedEndTime = convertTo24HourFormat(endTime);

    try {
        const deletedSlot = await TimeSlot.destroy({
            where: {
                doctorId: doctor.id,
                day,
                startTime: { [Op.eq]: formattedStartTime },
                endTime: { [Op.eq]: formattedEndTime },
                appointmentType,
                hospitalAffiliation: appointmentType === 'physical' ? hospitalAffiliation : null,
            },
        });

        if (!deletedSlot) {
            return res.status(404).json({ success: false, message: 'Time slot not found' });
        }

        return res.status(200).json({ success: true, message: 'Time slot deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error: Could not delete time slot',
            error: err.message,
        });
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
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    try {
        const appointmentType = req.query.type;
        const whereClause = { doctorId: doctor.id };

        // Filter by appointment type if provided
        if (appointmentType && ['online', 'physical'].includes(appointmentType)) {
            whereClause.appointmentType = appointmentType;
        }

        // Query time slots
        const timeSlots = await TimeSlot.findAll({ where: whereClause });

        return res.status(200).json({ success: true, timeSlots });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error: Could not fetch time slots',
            error: err.message,
        });
    }
});


// Get available time slots for a specific doctor
router.get('/show/time-slot/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    const { type: appointmentType, hospitalAffiliation } = req.query;

    try {
        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const whereClause = { doctorId };

        // Filter by appointment type if provided
        if (appointmentType && ['online', 'physical'].includes(appointmentType)) {
            whereClause.appointmentType = appointmentType;
        }

        // Filter by hospital affiliation if provided (only for physical appointments)
        if (hospitalAffiliation && appointmentType === 'physical') {
            whereClause.hospitalAffiliation = hospitalAffiliation;
        } else if (hospitalAffiliation && appointmentType === 'online') {
            return res.status(400).json({
                success: false,
                message: 'Hospital affiliation filter is only applicable for physical appointments',
            });
        }

        const timeSlots = await TimeSlot.findAll({ where: whereClause });
        return res.status(200).json({ success: true, timeSlots });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error: Could not fetch time slots',
            error: err.message,
        });
    }
});


module.exports = router;
