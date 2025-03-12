// controllers/createMeetingLinkController.js

const OnlinePortal  = require('../models/OnlinePortal');
const { v4: uuidv4 } = require('uuid');

exports.createMeetingLink = async (appointment) => {
    try {
        // Check if a meeting link already exists
        let meeting = await OnlinePortal.findOne({ where:  { appointmentId: appointment.id }});

        if (meeting) {
            return { success: true, message: "Meeting link already exists.", meeting };
        }

        // Generate a new meeting link and password
        const meetingId = uuidv4();
        const meetingLink = `http://localhost:5173/meeting/${meetingId}`;
        const meetingPassword = Math.random().toString(36).slice(-8); // Random password

        // Store in OnlinePortal model
        meeting = await OnlinePortal.create({
            appointmentId: appointment.id,
            meetingLink,
            meetingPassword
        });

        return { success: true, message: "Meeting link created successfully.", meeting };
    } catch (error) {
        console.error("Error generating meeting link:", error);
        return { success: false, message: "Error generating meeting link." };
    }
};
