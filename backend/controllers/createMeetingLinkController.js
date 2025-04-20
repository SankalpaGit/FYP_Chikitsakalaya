const OnlinePortal = require('../models/OnlinePortal');
const Appointment = require('../models/Appointment'); // Optional, kept for future use
const Patient = require('../models/Patient'); // Optional, kept for future use
const Doctor = require('../models/Doctor'); // Optional, kept for future use
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'joshisankalpa2@gmail.com',
    pass: 'pcee bzmf shst yjuh', // Replace with your Gmail App Password
  },
});

exports.createMeetingLink = async (appointment, patient, doctor) => {
    try {
        // Validate input parameters
        if (!appointment || !appointment.id || !patient || !patient.email || !doctor || !doctor.firstName || !doctor.lastName) {
            return { success: false, message: "Missing required appointment, patient, or doctor data." };
        }

        // Check if a meeting link already exists
        let meeting = await OnlinePortal.findOne({ where: { appointmentId: appointment.id } });

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

        // Prepare email content
        const mailOptions = {
            from: 'joshisankalpa2@gmail.com',
            to: patient.email,
            subject: 'Your Online Appointment Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Appointment Confirmation</h2>
                    <p>Thank you for choosing our healthcare services!</p>
                    <p>Your online appointment with Dr. ${doctor.firstName} ${doctor.lastName} is confirmed in our system.</p>
                    <p><strong>Details:</strong></p>
                    <ul>
                        <li>Date: ${new Date(appointment.date).toLocaleDateString()}</li>
                        <li>Time: ${appointment.startTime} - ${appointment.endTime}</li>
                        <li>Meeting Link: <a href="${meetingLink}">${meetingLink}</a></li>
                        <li>Meeting Password: ${meetingPassword}</li>
                    </ul>
                    <p>Join your appointment by clicking the button below:</p>
                    <a href="${meetingLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Join Meeting</a>
                    <p>If you have any questions, please contact our support team.</p>
                    <p>Best regards,<br>Your Healthcare Team</p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return { success: true, message: "Meeting link created and email sent successfully.", meeting };
    } catch (error) {
        console.error("Error generating meeting link or sending email:", error);
        return { success: false, message: `Error: ${error.message}` };
    }
};