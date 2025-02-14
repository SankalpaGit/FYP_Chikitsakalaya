// routes/doctorSearchRoutes.js

const express = require('express');
const router = express.Router();
const { Doctor, DoctorDetail } = require('../models'); // Assuming index.js exports both models
const { Op } = require('sequelize');

router.get('/search/doctors', async (req, res) => {
    try {
        const { firstName, lastName, speciality } = req.query;

        // Build the search query conditions
        const searchConditions = {
            where: { isApproved: true },
            attributes: ['id', 'firstName', 'lastName', 'email', 'licenseNumber', 'certificate', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: DoctorDetail,
                    as: 'doctorDetail',
                    attributes: ['speciality', 'experience', 'consultationFee', 'hospitalAffiliation', 'address', 'city', 'state', 'zipCode', 'country', 'profilePicture', 'isComplete'],
                    where: {} // Start with an empty condition for DoctorDetail
                }
            ]
        };

        // Add search conditions based on the query parameters
        if (firstName) {
            searchConditions.where.firstName = {
                [Op.iLike]: `%${firstName}%`  // Case-insensitive matching
            };
        }

        if (lastName) {
            searchConditions.where.lastName = {
                [Op.iLike]: `%${lastName}%`  // Case-insensitive matching
            };
        }

        if (speciality) {
            searchConditions.include[0].where.speciality = {
                [Op.iLike]: `%${speciality}%`  // Case-insensitive matching
            };
        }

        // Fetch the filtered doctors
        const doctors = await Doctor.findAll(searchConditions);

        // Group doctors by ID to ensure only the latest record for each doctor
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

module.exports = router;