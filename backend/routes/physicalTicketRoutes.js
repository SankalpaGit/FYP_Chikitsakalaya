const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const PhysicalTicket = require('../models/PhysicalTicket');
const Payment = require('../models/Payment');

const router = express.Router();

router.post('/generate/manual', async (req, res) => {
  try {
    // Find all physical appointments that are paid but don't have a ticket
    const appointments = await Appointment.findAll({
      where: { appointmentType: 'physical' },
      include: [
        {
          model: Payment,
          where: { paymentStatus: 'paid' }, // Only get paid appointments
          required: true,
        },
        {
          model: PhysicalTicket,
          required: false, // Get tickets if they exist
        },
      ],
    });

    const newTickets = [];

    for (const appointment of appointments) {
      if (appointment.PhysicalTicket) continue; // Skip if a ticket already exists

      // Generate an 8-character token number
      const tokenNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

      const dir = path.join(__dirname, '../public/tickets');

      // Check if the directory exists, and create it if not
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Define the path for the PDF file
      const pdfPath = path.join(dir, `${tokenNumber}.pdf`);

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

      // Save ticket details in the database
      const newTicket = await PhysicalTicket.create({
        appointmentId: appointment.id,
        tokenNumber,
        pdfLink: `/public/tickets/${tokenNumber}.pdf`, // Store relative path
      });

      newTickets.push(newTicket);
    }

    if (newTickets.length === 0) {
      return res.status(200).json({ message: 'No new tickets generated' });
    }

    res.status(201).json({ message: 'Tickets generated successfully', tickets: newTickets });
  } catch (error) {
    console.error('Error generating tickets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
