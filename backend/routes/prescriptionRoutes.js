// routes/PrescriptionRoutes.js

const express = require('express');
const { Appointment, Patient, Prescription, PrescriptionMedicine, Doctor } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware'); // assuming JWT or session-based auth
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const router = express.Router();

// API to Get Patients of Completed Appointments for Logged-In Doctor
router.get('/appointments/completed-patients', authMiddleware, async (req, res) => {
    try {
        const doctorId = req.user.doctorId; // From authMiddleware

        const appointments = await Appointment.findAll({
            where: {
                doctorId,
                isComplete: true,
                isCancelled: false,
            },
            include: {
                model: Patient,
                attributes: ['id', 'firstName', 'lastName'],
            },
        });

        // Use a Map to ensure unique patients
        const patientMap = new Map();

        appointments.forEach(app => {
            if (app.Patient && !patientMap.has(app.Patient.id)) {
                patientMap.set(app.Patient.id, {
                    id: app.Patient.id,
                    name: `${app.Patient.firstName} ${app.Patient.lastName}`,
                    appointmentId: app.id, // Still useful to prefill or trace back
                });
            }
        });

        const patientList = Array.from(patientMap.values());

        return res.status(200).json(patientList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching completed patients.' });
    }
});


// 2) API to Create Prescription and Medications
router.post('/prescriptions', authMiddleware, async (req, res) => {
    const { appointmentId, diagnosis, notes, medications } = req.body;

    try {
        // Create Prescription
        const prescription = await Prescription.create({
            appointmentId,
            diagnosis,
            notes,
        });

        // Bulk create Medication entries linked to the Prescription
        const medicationData = medications.map((med) => ({
            ...med,
            prescriptionId: prescription.id,
        }));

        await PrescriptionMedicine.bulkCreate(medicationData);

        return res.status(201).json({ message: 'Prescription created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create prescription' });
    }
});

router.get('/prescription/patient', authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }

        const patient = await Patient.findByPk(decoded.id);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // Step 1: Get all appointment IDs for the patient
        const appointments = await Appointment.findAll({
            where: { patientId: patient.id },
            attributes: ['id'],
        });

        const appointmentIds = appointments.map(a => a.id);

        // Step 2: Get all prescriptions for those appointments
        const prescriptions = await Prescription.findAll({
            include: [
              {
                model: Appointment,
                where: { patientId: patient.id },
                include: [
                  {
                    model: Doctor,
                    attributes: ['firstName'],
                  },
                ],
              },
              {
                model: PrescriptionMedicine,
                attributes: ['medicineName', 'dosage', 'frequency', 'duration', 'instruction'],
              },
            ],
          });
          
          

        return res.json({ success: true, prescriptions });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error retrieving prescriptions for patient' });
    }
});

router.get('/prescription/doctor', authMiddleware, async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
  
      const doctor = await Doctor.findByPk(decoded.doctorId);
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
  
      // Fetch prescriptions created by this doctor (through their appointments)
      const prescriptions = await Prescription.findAll({
        include: [
          {
            model: Appointment,
            required: true,
            where: { doctorId: doctor.id },
            include: [
              {
                model: Patient,
                attributes: ['firstName', 'lastName'], // Include full name
              },
            ],
          },
          {
            model: PrescriptionMedicine,
            attributes: ['medicineName', 'dosage', 'frequency', 'duration', 'instruction'],
          },
        ],
        order: [['createdAt', 'DESC']], // Optional: newest first
      });
  
      return res.json({ success: true, prescriptions });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving prescriptions for doctor' });
    }
  });
  

module.exports = router;
