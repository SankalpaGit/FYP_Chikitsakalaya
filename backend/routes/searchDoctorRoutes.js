const axios = require('axios');
const express = require('express');
const router = express.Router();
const { Doctor, DoctorDetail } = require('../models');
const { Op, Sequelize } = require('sequelize');
const optionalAuth = require('../middlewares/optionalAuth');
const SearchLog = require('../models/SearchLog');

router.get('/search/doctors', optionalAuth, async (req, res) => {
  try {
    const user = req.user;
    const { query, minFee, maxFee, state, minExp, maxExp } = req.query;
    const whereClause = { isApproved: true };
    const doctorDetailWhere = {};

    // Build search filters
    if (query) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${query}%` } },
        { lastName: { [Op.like]: `%${query}%` } },
        { '$doctorDetails.speciality$': { [Op.like]: `%${query}%` } },
      ];
    }

    if (minFee || maxFee) {
      doctorDetailWhere.consultationFee = {};
      if (minFee) doctorDetailWhere.consultationFee[Op.gte] = parseFloat(minFee);
      if (maxFee) doctorDetailWhere.consultationFee[Op.lte] = parseFloat(maxFee);
    }

    if (state) doctorDetailWhere.state = { [Op.like]: `%${state}%` };

    if (minExp || maxExp) {
      doctorDetailWhere.experience = {};
      if (minExp) doctorDetailWhere.experience[Op.gte] = parseInt(minExp);
      if (maxExp) doctorDetailWhere.experience[Op.lte] = parseInt(maxExp);
    }

    // Fetch latest DoctorDetail for each doctor
    const latestDoctorDetails = await DoctorDetail.findAll({
      attributes: ['id', 'doctorId'],
      where: {
        ...doctorDetailWhere,
        updatedAt: {
          [Op.eq]: Sequelize.literal(
            `(SELECT MAX(updatedAt) FROM DoctorDetails AS d2 WHERE d2.doctorId = DoctorDetail.doctorId)`
          ),
        },
      },
      raw: true,
    });

    const latestDoctorDetailIds = latestDoctorDetails.map((detail) => detail.id);

    // Fetch doctors with latest DoctorDetail
    const doctors = await Doctor.findAll({
      where: whereClause,
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'licenseNumber',
        'certificate',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: DoctorDetail,
          as: 'doctorDetails',
          attributes: [
            'speciality',
            'experience',
            'consultationFee',
            'state',
            'country',
            'profilePicture',
            'isComplete',
          ],
          required: false,
          where: { id: latestDoctorDetailIds },
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    // Send response
    res.status(200).json({ success: true, data: doctors });

    // Log search for authenticated users
    if (user && user.id) {
      const searchFilters = { minFee, maxFee, state, minExp, maxExp };
      const logs = doctors.map((doc) => ({
        patientId: user.id,
        doctorId: doc.id,
        doctorName: `${doc.firstName} ${doc.lastName}`,
        speciality: doc.doctorDetails?.[0]?.speciality || 'Unknown',
        query: query || null,
        filters: JSON.stringify(searchFilters),
        timestamp: new Date(),
      }));

      await SearchLog.bulkCreate(logs);
      console.log(`Search logs saved for user ${user.id}`);
    } else {
      console.log('No search logs saved (user not authenticated)');
    }
  } catch (error) {
    console.error('Error in /search/doctors:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;