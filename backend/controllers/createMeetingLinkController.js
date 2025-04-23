const OnlinePortal  = require('../models/OnlinePortal');
const { v4: uuidv4 } = require('uuid');

exports.createMeetingLink = async (appointment, transaction) => {
    try {
        // Validate input parameters
        if (!appointment || !appointment.id || !appointment.appointmentType) {
            return { success: false, message: "Missing required appointment data." };
        }

        // Only generate meeting link for online appointments
        if (appointment.appointmentType !== 'online') {
            return { success: true, message: "No meeting link needed for non-online appointments." };
        }

        // Check if a meeting link already exists
        let meeting = await OnlinePortal.findOne({ 
            where: { appointmentId: appointment.id },
            transaction
        });

        if (meeting) {
            return { success: true, message: "Meeting link already exists.", meeting };
        }

        // Generate a new meeting link and password
        const meetingId = uuidv4();
        const meetingLink = `http://localhost:5173/meeting/${meetingId}`;
        const meetingPassword = Math.random().toString(36).slice(-8); // Random 8-character password

        // Store in OnlinePortal model
        meeting = await OnlinePortal.create({
            appointmentId: appointment.id,
            meetingLink,
            meetingPassword
        }, { transaction });

        return { success: true, message: "Meeting link created successfully.", meeting };
    } catch (error) {
        console.error("Error generating meeting link:", error);
        return { success: false, message: `Error: ${error.message}` };
    }
};