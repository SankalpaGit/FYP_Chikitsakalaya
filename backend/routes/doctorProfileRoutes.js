const express = require("express");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const DoctorDetail = require("../models/DoctorDetail");
const upload = require("../config/multer"); // Import your multer setup
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Combined route to update both basic and detailed doctor information
router.post("/doctor/update", authenticate, upload.single('profilePicture'), upload.handleFileUploadError, async (req, res) => {
    try {
        // Extract and verify token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Store decoded token in req.user
            console.log("Decoded user:", decoded);
        } catch (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }

        const { firstName, lastName, speciality, experience, consultationFee, hospitalAffiliation, address, city, state, zipCode, country } = req.body;
        const profilePicturePath = req.file ? req.file.path : null;

        // Update Doctor Basic Info
        const doctor = await Doctor.findByPk(req.user.doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        await doctor.update({
            firstName,
            lastName,
        });

        // Check if the DoctorDetail exists for this doctor
        const doctorDetail = await DoctorDetail.findOne({
            where: { doctorId: req.user.doctorId },
        });

        if (doctorDetail) {
            // If DoctorDetail exists, update it
            await doctorDetail.update({
                speciality,
                experience,
                consultationFee,
                hospitalAffiliation,
                address,
                city,
                state,
                zipCode,
                country,
                profilePicture: profilePicturePath,
                isComplete: true,
            });
        } else {
            // If DoctorDetail does not exist, create a new record
            await DoctorDetail.create({
                doctorId: req.user.doctorId,
                speciality,
                experience,
                consultationFee,
                hospitalAffiliation,
                address,
                city,
                state,
                zipCode,
                country,
                profilePicture: profilePicturePath,
                isComplete: true,
            });
        }

        res.json({ success: true, message: "Doctor profile updated successfully" });
    } catch (error) {
        console.error("Error updating doctor profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// Combined route to fetch both basic and detailed doctor information
router.get("/doctor/view", authenticate, async (req, res) => {
    try {
        // Extract and verify token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Store decoded token in req.user
            console.log("Decoded user:", decoded);
        } catch (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }

        const doctor = await Doctor.findByPk(req.user.doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const doctorDetail = await DoctorDetail.findOne({ where: { doctorId: req.user.doctorId } });
        console.log(doctor); 
        console.log(doctorDetail);
        if (!doctorDetail) {
            return res.status(404).json({ success: false, message: "Doctor details not found" });
        }

        res.json({
            success: true,
            doctor: {
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                licenseNumber: doctor.licenseNumber,
                certificate: doctor.certificate,
                speciality: doctorDetail.speciality,
                experience: doctorDetail.experience,
                consultationFee: doctorDetail.consultationFee,
                hospitalAffiliation: doctorDetail.hospitalAffiliation,
                address: doctorDetail.address,
                city: doctorDetail.city,
                state: doctorDetail.state,
                zipCode: doctorDetail.zipCode,
                country: doctorDetail.country,
                profilePicture: doctorDetail.profilePicture,
                isComplete: doctorDetail.isComplete,
            },
        });
    } catch (error) {
        console.error("Error fetching doctor details:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
