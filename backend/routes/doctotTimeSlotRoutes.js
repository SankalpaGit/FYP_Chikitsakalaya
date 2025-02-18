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
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const timeSlots = req.body; // Expecting an array of time slots
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid time slot data' });
    }

    try {
        const newTimeSlots = [];
        for (const slot of timeSlots) {
            const { day, startTime, endTime } = slot;
            if (!day || !startTime || !endTime) {
                return res.status(400).json({ success: false, message: 'Each time slot must have a day, startTime, and endTime' });
            }

            // Check for conflicting time slots
            const conflictingSlot = await TimeSlot.findOne({
                where: {
                    doctorId: doctor.id,
                    day,
                    [Op.or]: [
                        { startTime: { [Op.between]: [startTime, endTime] } },
                        { endTime: { [Op.between]: [startTime, endTime] } },
                        {
                            [Op.and]: [
                                { startTime: { [Op.lte]: startTime } },
                                { endTime: { [Op.gte]: endTime } }
                            ]
                        }
                    ]
                }
            });

            if (conflictingSlot) {
                return res.status(400).json({ success: false, message: 'Time slot conflicts with an existing slot' });
            }

            const newSlot = await TimeSlot.create({ doctorId: doctor.id, day, startTime, endTime });
            newTimeSlots.push(newSlot);
        }

        return res.status(201).json({ success: true, message: 'Time slots added successfully', data: newTimeSlots });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error: Could not create time slots', error: err.message });
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
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const { day, startTime, endTime } = req.body;
    if (!day || !startTime || !endTime) {
        return res.status(400).json({ success: false, message: 'Missing required fields (day, startTime, endTime)' });
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
                endTime: { [Op.eq]: formattedEndTime }
            }
        });

        if (!deletedSlot) {
            return res.status(404).json({ success: false, message: 'Time slot not found' });
        }

        return res.status(200).json({ success: true, message: 'Time slot deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error: Could not delete time slot', error: err.message });
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
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    try {
        const timeSlots = await TimeSlot.findAll({ where: { doctorId: doctor.id } });
        return res.status(200).json({ success: true, timeSlots });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error: Could not fetch time slots', error: err.message });
    }
});

module.exports = router;
