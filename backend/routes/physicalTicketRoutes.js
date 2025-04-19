const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Add this import
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Payment = require('../models/Payment');

router.get('/invoices/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Received Token:', token); // Log the token

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    let decoded;
    try {
      console.log('Verifying token with JWT_SECRET:', process.env.JWT_SECRET); // Log the secret
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); // Log the decoded payload
    } catch (err) {
      console.error('Token Verification Error:', err.message); // Log the error
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    const patient = await Patient.findByPk(decoded.id);
    if (!patient) {
      console.log('Patient not found for ID:', decoded.id);
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const invoices = await Appointment.findAll({
      attributes: [
        'id',
        'appointmentType',
        'hospitalAffiliation',
        'date',
        'StartTime',
        'EndTime',
      ],
      where: {
        appointmentType: 'physical',
      },
      include: [
        {
          model: Patient,
          where: { id: decoded.id }, // Fix: Use decoded.id instead of patientId
          attributes: ['firstName', 'lastName'],
        },
        {
          model: Doctor,
          attributes: ['firstName', 'lastName', 'licenseNumber'],
        },
        {
          model: Payment,
          attributes: ['paymentMethod', 'amount'],
          where: {
            paymentStatus: 'paid',
          },
          required: true,
        },
      ],
      distinct: true,
    });

    // Format the response and add a tokenNumber for each invoice
    const formattedInvoices = invoices.map((invoice) => {
      const tokenNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
      return {
        tokenNumber,
        patientFirstName: invoice.Patient.firstName,
        patientLastName: invoice.Patient.lastName,
        appointmentType: invoice.appointmentType,
        appointmentId: invoice.id,
        hospitalAffiliation: invoice.hospitalAffiliation,
        date: invoice.date,
        startTime: invoice.StartTime,
        endTime: invoice.EndTime,
        doctorFirstName: invoice.Doctor.firstName,
        doctorLastName: invoice.Doctor.lastName,
        doctorLicenseNumber: invoice.Doctor.licenseNumber,
        paymentMethod: invoice.Payment.paymentMethod,
        amount: invoice.Payment.amount,
      };
    });

    res.status(200).json({ success: true, invoices: formattedInvoices });
  } catch (error) {
    console.error('Error fetching invoices for user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;