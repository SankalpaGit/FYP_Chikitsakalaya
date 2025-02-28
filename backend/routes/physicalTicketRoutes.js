const express = require('express');
const PhysicalTicket = require('../models/PhysicalTicket');
const Appointment = require('../models/Appointment');

const router = express.Router();

router.get('/tickets/:appointmentId', async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const ticket = await PhysicalTicket.findOne({ where: { appointmentId } });

        if (!ticket) {
            return res.status(404).json({ success: false, message: "No ticket found for this appointment." });
        }

        res.status(200).json({ success: true, ticket });
    } catch (error) {
        console.error("Error fetching ticket:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


router.get('/tickets/patient/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;

        const appointments = await Appointment.findAll({
            where: { patientId, appointmentType: 'physical' },
            include: [{ model: PhysicalTicket }],
        });

        const tickets = appointments.map(app => app.PhysicalTicket).filter(ticket => ticket);

        if (tickets.length === 0) {
            return res.status(404).json({ success: false, message: "No tickets found for this patient." });
        }

        res.status(200).json({ success: true, tickets });
    } catch (error) {
        console.error("Error fetching patient tickets:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
