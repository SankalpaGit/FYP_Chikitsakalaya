// routes/userProfileRoutes.js 


const express = require('express');
const upload = require('../config/multer');
const extractTextFromImage = require('../config/tesseractConfig');
const { Patient } = require('../models');
const jwt = require('jsonwebtoken');
const { PatientReport } = require('../models');
const router = express.Router();

//  POST routes for the OCR Based User Profile ( personal profile done , medical profile is yet to be)
router.post('/upload/Report', upload.single('report'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        // Extract and verify token
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

        // Process OCR (Extract personal info)
        const extractedData = await extractTextFromImage(req.file.path);
        const { personal } = extractedData;

        // Validate extracted data
        if (!personal || !personal.firstName || !personal.lastName) {
            return res.status(422).json({ success: false, message: 'Incomplete or invalid data extracted' });
        }

        // Update patient info (only if empty)
        await patient.update({
            firstName: patient.firstName || personal.firstName,
            lastName: patient.lastName || personal.lastName,
            dateOfBirth: patient.dateOfBirth || personal.dob,
            gender: patient.gender || personal.gender,
            phone: patient.phone || personal.phone,
            address: patient.address || personal.address,
        });

        // Update profile completion status
        const isComplete = patient.firstName && patient.lastName && patient.dateOfBirth && patient.gender && patient.phone && patient.address;
        if (isComplete && !patient.isProfileComplete) {
            await patient.update({ isProfileComplete: true });
        }

        // Store report
        const report = await PatientReport.create({
            patientId: patient.id,
            reportFilePath: req.file.path,
        });

        res.json({ success: true, message: 'Profile updated via OCR', patient, report });
    } catch (error) {
        console.error('Error processing OCR:', error);
        res.status(500).json({ success: false, message: 'Server error processing OCR', error: error.message });
    }
});


// POST route for manual profile update ( personal profile)
router.put('/updateProfile', upload.single('profileImage'), async (req, res) => {
    try {
        // Extract and verify token
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

        // Extract form data
        const { dateOfBirth, gender, phone, address } = req.body;

        // Handle profile image upload
        let profileImage = patient.profileImage;
        if (req.file) {
            profileImage = req.file.path; // Save file path
        }

        // Update patient data
        await patient.update({
            dateOfBirth: dateOfBirth || patient.dateOfBirth,
            gender: gender || patient.gender,
            phone: phone || patient.phone,
            address: address || patient.address,
            profileImage: profileImage,
        });

        // Check profile completeness
        const isComplete = patient.firstName && patient.lastName && patient.dateOfBirth && patient.gender && patient.phone && patient.address;
        if (isComplete && !patient.isProfileComplete) {
            await patient.update({ isProfileComplete: true });
        }

        res.json({ success: true, message: 'Profile updated successfully', patient });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
    }
});


router.get('/getProfile', async (req, res) => {
    try {
        // Extract and verify token
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

        const patient = await Patient.findByPk(decoded.id, {
            attributes: { exclude: ['password', 'otp', 'otpExpiration'] }, // Hide sensitive fields
        });

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        res.json({ success: true, patient });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Server error fetching profile', error: error.message });
    }
});




module.exports = router;
