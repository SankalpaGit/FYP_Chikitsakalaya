const express = require('express');
const router = express.Router();
const { Doctor, DoctorDetail } = require('../models');
const { Op } = require('sequelize');

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
                { '$doctorDetail.speciality$': { [Op.like]: `%${query}%` } }
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

        let doctors = await Doctor.findAll({
            where: whereClause,
            attributes: ['id', 'firstName', 'lastName', 'email', 'licenseNumber', 'certificate', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: DoctorDetail,
                    as: 'doctorDetail',
                    attributes: ['speciality', 'experience', 'consultationFee', 'hospitalAffiliation', 'address', 'city', 'state', 'zipCode', 'country', 'profilePicture', 'isComplete'],
                    where: doctorDetailWhere
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