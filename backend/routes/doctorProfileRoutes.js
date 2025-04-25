const express = require("express");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const DoctorDetail = require("../models/DoctorDetail");
const upload = require("../config/multer");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Combined route to update both basic and detailed doctor information
router.post("/doctor/update", authenticate, upload.single('profilePicture'), upload.handleFileUploadError, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            console.log("✅ Decoded user:", decoded);
        } catch (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }

        const {
            firstName, lastName,
            speciality, experience,
            consultationFee, state, country
        } = req.body;

        const profilePicturePath = req.file ? req.file.path : null;

        // Build update objects only with provided fields
        const basicInfoToUpdate = {};
        if (firstName) basicInfoToUpdate.firstName = firstName;
        if (lastName) basicInfoToUpdate.lastName = lastName;

        const detailToUpdate = {};
        if (speciality) detailToUpdate.speciality = speciality;
        if (experience) detailToUpdate.experience = experience;

        if (consultationFee) detailToUpdate.consultationFee = consultationFee;
        if (state) detailToUpdate.state = state;
        if (country) detailToUpdate.country = country;
        if (profilePicturePath) detailToUpdate.profilePicture = profilePicturePath;

        const doctor = await Doctor.findByPk(req.user.doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        if (Object.keys(basicInfoToUpdate).length > 0) {
            await doctor.update(basicInfoToUpdate);
        }

        const doctorDetail = await DoctorDetail.findOne({ where: { doctorId: req.user.doctorId } });

        if (doctorDetail) {
            if (Object.keys(detailToUpdate).length > 0) {
                detailToUpdate.isComplete = true; // Mark as complete if any detail is updated
                await doctorDetail.update(detailToUpdate);
            }
        } else if (Object.keys(detailToUpdate).length > 0) {
            await DoctorDetail.create({
                doctorId: req.user.doctorId,
                ...detailToUpdate,
                isComplete: true, // Mark as complete on creation
            });
        }

        res.json({ success: true, message: "Doctor profile updated successfully" });
    } catch (error) {
        console.error("🚨 Error updating doctor profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Combined route to fetch both basic and detailed doctor information
router.get("/doctor/view", authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }

        const doctor = await Doctor.findByPk(req.user.doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const doctorDetail = await DoctorDetail.findOne({ where: { doctorId: req.user.doctorId } });

        // Build the response with both base and detail info
        const doctorResponse = {
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            licenseNumber: doctor.licenseNumber,
            certificate: doctor.certificate,
            speciality: doctorDetail?.speciality || null,
            experience: doctorDetail?.experience || null,
            consultationFee: doctorDetail?.consultationFee || null,
            state: doctorDetail?.state || null,
            country: doctorDetail?.country || null,
            profilePicture: doctorDetail?.profilePicture || null,
            isComplete: doctorDetail?.isComplete || false
        };

        res.json({
            success: true,
            doctor: doctorResponse
        });
    } catch (error) {
        console.error("🚨 Error in /doctor/view:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;