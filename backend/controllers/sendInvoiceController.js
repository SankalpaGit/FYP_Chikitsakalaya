// controller/sendInvoicesController.js

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const PhysicalTicket = require('../models/PhysicalTicket');

exports.sendInvoice = async (appointment) => {
    try {
        // Check if ticket already exists
        const existingTicket = await PhysicalTicket.findOne({ where: { appointmentId: appointment.id } });
        if (existingTicket) {
            console.log(`Ticket already exists for appointment ${appointment.id}`);
            return existingTicket;
        }

        // Generate a random 8-character token number
        const tokenNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

        const dir = path.join(__dirname, '../public/tickets');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        // Define PDF path
        const pdfPath = path.join(dir, `${tokenNumber}.pdf`);

        // Generate PDF
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.fontSize(20).text(`Appointment Ticket`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Token Number: ${tokenNumber}`);
        doc.text(`Appointment ID: ${appointment.id}`);
        doc.text(`Patient ID: ${appointment.patientId}`);
        doc.text(`Doctor ID: ${appointment.doctorId}`);
        doc.text(`Date: ${appointment.date}`);
        doc.text(`Start Time: ${appointment.StartTime}`);
        doc.text(`End Time: ${appointment.EndTime}`);
        doc.end();

        // Save ticket in DB
        const newTicket = await PhysicalTicket.create({
            appointmentId: appointment.id,
            tokenNumber,
            pdfLink: `/public/tickets/${tokenNumber}.pdf`,
        });

        console.log(`Ticket generated and sent for appointment ${appointment.id}`);
        return newTicket;
    } catch (error) {
        console.error("Error generating and sending ticket:", error);
        throw error;
    }
};
