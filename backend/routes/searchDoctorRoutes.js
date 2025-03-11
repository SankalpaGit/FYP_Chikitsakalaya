const express = require('express');
const router = express.Router();
const { Doctor, DoctorDetail } = require('../models');
const { Op, Sequelize, literal } = require('sequelize');

router.get('/search/doctors', async (req, res) => {
    try {
        const { query, minFee, maxFee, city, state, minExp, maxExp } = req.query;
        const whereClause = { isApproved: true };
        const doctorDetailWhere = {};

        // Search logic (matches first name, last name, or specialty)
        if (query) {
            whereClause[Op.or] = [
                { firstName: { [Op.like]: `%${query}%` } },
                { lastName: { [Op.like]: `%${query}%` } },
                { '$doctorDetails.speciality$': { [Op.like]: `%${query}%` } }
            ];
        }

        // Consultation Fee Filter
        if (minFee || maxFee) {
            doctorDetailWhere.consultationFee = {};
            if (minFee) doctorDetailWhere.consultationFee[Op.gte] = parseFloat(minFee);
            if (maxFee) doctorDetailWhere.consultationFee[Op.lte] = parseFloat(maxFee);
        }

        // City & State Filter
        if (city) doctorDetailWhere.city = { [Op.like]: `%${city}%` };
        if (state) doctorDetailWhere.state = { [Op.like]: `%${state}%` };

        // Experience Filter
        if (minExp || maxExp) {
            doctorDetailWhere.experience = {};
            if (minExp) doctorDetailWhere.experience[Op.gte] = parseInt(minExp);
            if (maxExp) doctorDetailWhere.experience[Op.lte] = parseInt(maxExp);
        }

        // Fetch the latest DoctorDetail for each doctor using a subquery
        const latestDoctorDetails = await DoctorDetail.findAll({
            attributes: ['id', 'doctorId'],
            where: {
                ...doctorDetailWhere,
                updatedAt: {
                    [Op.eq]: Sequelize.literal(
                        `(SELECT MAX(updatedAt) FROM DoctorDetails AS d2 WHERE d2.doctorId = DoctorDetail.doctorId)`
                    )
                }
            },
            raw: true
        });

        // Extract doctor IDs from the latest details
        const latestDoctorDetailIds = latestDoctorDetails.map(detail => detail.id);

        // Fetch doctors with only the latest DoctorDetail
        let doctors = await Doctor.findAll({
            where: whereClause,
            attributes: ['id', 'firstName', 'lastName', 'email', 'licenseNumber', 'certificate', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: DoctorDetail,
                    as: 'doctorDetails',
                    attributes: ['speciality', 'experience', 'consultationFee', 'hospitalAffiliation', 'address', 'city', 'state', 'zipCode', 'country', 'profilePicture', 'isComplete'],
                    required: false,
                    where: {
                        id: latestDoctorDetailIds  // Only include latest details
                    }
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
