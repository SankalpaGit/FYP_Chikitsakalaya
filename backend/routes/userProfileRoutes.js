// routes/userProfileRoutes.js 

// This routes is the specific implementation for the OCR Based User Profile

const express = require('express');
const upload = require('../config/multer');
const extractTextFromImage = require('../config/tesseractConfig');
const { Patient, PatientReport, Diagnosis, Test, Medication } = require('../models');

const router = express.Router();

router.post('/upload/Report', upload.single('report'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        // Extract structured data from OCR
        const extractedData = await extractTextFromImage(req.file.path);
        const { personal, medical } = extractedData;

        // Find patient based on phone number
        let patient = await Patient.findOne({ where: { phone: personal.phone } });

        if (!patient) {
            // Create new patient if not found
            patient = await Patient.create({
                firstName: personal.firstName,
                lastName: personal.lastName,
                dateOfBirth: personal.dob,
                gender: personal.gender,
                phone: personal.phone,
                address: personal.address,
            });
        } else {
            // If patient exists, retain existing details
            await patient.update({
                firstName: patient.firstName || personal.firstName,
                lastName: patient.lastName || personal.lastName,
                dateOfBirth: patient.dateOfBirth || personal.dob,
                gender: patient.gender || personal.gender,
                phone: patient.phone || personal.phone,
                address: patient.address || personal.address,
            });
        }

        // Create Patient Report linked to Patient
        const report = await PatientReport.create({
            patientId: patient.id,
            reportFilePath: req.file.path,
        });

        // Store Diagnoses
        if (medical.diagnoses.length > 0) {
            await Diagnosis.bulkCreate(
                medical.diagnoses.map((d) => ({ reportId: report.id, diagnosisName: d }))
            );
        }

        // Store Tests
        if (medical.tests.length > 0) {
            await Test.bulkCreate(
                medical.tests.map((t) => ({ reportId: report.id, testName: t }))
            );
        }

        // Store Medications
        if (medical.medications.length > 0) {
            await Medication.bulkCreate(
                medical.medications.map((m) => ({ reportId: report.id, medicationName: m }))
            );
        }

        res.json({ success: true, patient, report });
    } catch (error) {
        console.error('Error processing OCR:', error);
        res.status(500).json({ success: false, message: 'Error extracting data', error: error.message });
    }
});

module.exports = router;
