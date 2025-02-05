// routes/userProfileRoutes.js 

// This routes is the specific implementation for the OCR Based User Profile
const express = require('express');
const upload = require('../config/multer');
const extractTextFromImage = require('../config/tesseractConfig');
const { Patient } = require('../models');
const jwt = require('jsonwebtoken');
const { PatientReport } = require('../models');
const router = express.Router();

router.post('/upload/Report', upload.single('report'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        // Extract token from request headers
        const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        // Verify the token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //  get the user ID
        const patient = await Patient.findByPk(decoded.id);

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // Process OCR (Only Personal Info for Now)
        const extractedData = await extractTextFromImage(req.file.path);
        const { personal } = extractedData;

        // Update patient info (only if empty)
        await patient.update({
            firstName: patient.firstName || personal.firstName,
            lastName: patient.lastName || personal.lastName,
            dateOfBirth: patient.dateOfBirth || personal.dob,
            gender: patient.gender || personal.gender,
            phone: patient.phone || personal.phone,
            address: patient.address || personal.address,
        });

        // Create the patient report linked to this user
        const report = await PatientReport.create({
            patientId: patient.id,
            reportFilePath: req.file.path,
        });

        res.json({ success: true, patient, report });
    } catch (error) {
        console.error('Error processing OCR:', error);
        res.status(500).json({ success: false, message: 'Error extracting data', error: error.message });
    }
});


module.exports = router;
