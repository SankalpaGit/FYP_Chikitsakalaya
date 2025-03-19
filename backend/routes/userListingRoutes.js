const express = require('express');
const router = express.Router();
const { Doctor, DoctorDetail } = require('../models'); // Assuming index.js exports both models
const { Op } = require('sequelize');

router.get('/accepted/doctors/all', async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            where: { isApproved: true },
            attributes: ['id', 'firstName', 'lastName', 'email', 'licenseNumber', 'certificate', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: DoctorDetail,
                    as: 'doctorDetails',
                    attributes: ['speciality', 'experience', 'consultationFee', 'hospitalAffiliation', 'address', 'city', 'state', 'zipCode', 'country', 'profilePicture', 'isComplete']
                }
            ]
        });

        // Group doctors by ID and select the one with the most recent updatedAt
        const doctorMap = new Map();

        doctors.forEach(doctor => {
            if (!doctorMap.has(doctor.id) || new Date(doctor.updatedAt) > new Date(doctorMap.get(doctor.id).updatedAt)) {
                doctorMap.set(doctor.id, doctor);
            }
        });

        // Convert map values to array and send response
        const latestDoctors = Array.from(doctorMap.values());

        res.status(200).json({ success: true, data: latestDoctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


router.get('/accepted/doctor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findOne({
            where: { id, isApproved: true },
            attributes: ['id', 'firstName', 'lastName', 'email', 'licenseNumber', 'certificate', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: DoctorDetail,
                    as: 'doctorDetail',
                    attributes: ['speciality', 'experience', 'consultationFee', 'hospitalAffiliation', 'address', 'city', 'state', 'zipCode', 'country', 'profilePicture', 'isComplete'],
                    order: [['updatedAt', 'DESC']], // Ensure latest record is fetched
                    limit: 1 // Only fetch the latest change
                }
            ]
        });

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found or not approved' });
        }

        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;