// routes/onlinePortal.js
const express = require('express');
const OnlinePortal = require('../models/OnlinePortal');
const router = express.Router();

// Route to fetch meeting link based on appointment ID
router.get('/get-meeting-link/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const onlinePortal = await OnlinePortal.findOne({
      where: { appointmentId }
    });

    if (onlinePortal) {
      return res.status(200).json({ meetingLink: onlinePortal.meetingLink });
    } else {
      return res.status(404).json({ message: 'Online portal for this appointment not found.' });
    }
  } catch (error) {
    console.error('Error fetching meeting link:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
